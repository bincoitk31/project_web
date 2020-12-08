defmodule ProjectWebWeb.Plug.CollectPlug do
  import Plug.Conn
  import Phoenix.Controller

  alias ProjectWeb.Tools

  @version 1
  @transparent_gif_buffer [
    0x47,
    0x49,
    0x46,
    0x38,
    0x39,
    0x61,
    0x01,
    0x00,
    0x01,
    0x00,
    0x80,
    0x00,
    0x00,
    0xFF,
    0xFF,
    0xFF,
    0x00,
    0x00,
    0x00,
    0x2C,
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x01,
    0x00,
    0x00,
    0x02,
    0x02,
    0x44,
    0x01,
    0x00,
    0x3B
  ]

  def init(opts), do: opts

  def call(conn, opts) do
    conn = fetch_cookies(conn)
    params = conn.query_params || %{}
    # _pa: 2 years - Used to distinguish users.
    # _pid: 24 hours - Used to distinguish users.
    # _pat: 1 min - Used to throttle request rate
    pat = params["_pat"] |> IO.inspect(label: "PAT")
    pid = params["_pid"] |> IO.inspect(label: "PID")
    pa = params["_pa"] |> IO.inspect(label: "PAG")

    if Tools.is_empty?(pid) || Tools.is_empty?(pa) || Tools.is_empty?(pat) do
      conn
      |> put_resp_header("x-onerr", "no-params")
      |> send_resp(200, @transparent_gif_buffer)
      |> halt()
    else
      do_plug(conn, opts)
    end
  end

  def do_plug(conn, _opts) do
    cookies = conn.req_cookies
    params = conn.query_params || %{}
    # _pa: 2 years - Used to distinguish users.
    # _pid: 24 hours - Used to distinguish users.
    # _pat: 1 min - Used to throttle request rate
    pat = params["_pat"] |> IO.inspect(label: "PAT")
    pid = params["_pid"] |> IO.inspect(label: "PID")
    pa = params["_pa"] |> IO.inspect(label: "PAG")

    now = DateTime.utc_now() |> DateTime.to_unix()

    rand_user = Ecto.UUID.generate()
    sub_domain_count = conn.host |> String.split(".") |> Enum.count()

    conn =
      if Tools.is_empty?(pa) do
        put_resp_cookie(
          conn,
          "_pa",
          "PA#{@version}.#{now}.#{sub_domain_count}.#{rand_user}",
          max_age: 60 * 60 * 24 * 365
        )
      else
        conn
      end

    conn =
      if Tools.is_empty?(pid) do
        put_resp_cookie(
          conn,
          "_pid",
          "PID#{@version}.#{now}.#{sub_domain_count}.#{rand_user}",
          max_age: 60 * 60 * 24
        )
      else
        conn
      end

    conn =
      if Tools.is_empty?(pat) do
        rand = Ecto.UUID.generate() |> String.replace("-", "")

        put_resp_cookie(
          conn,
          "_pat",
          "PAT#{@version}.#{now}.#{rand}",
          max_age: 60
        )
      else
        conn
      end

    user_hour = pid || conn.resp_cookies["_pid"][:value]
    user_year = pa || conn.resp_cookies["_pa"][:value]

    conn =
      conn
      |> assign(:user_hour, user_hour)
      |> assign(:user_year, user_year)

    # throttle_req(conn, pat)
    # |> final()
  end

  # defp throttle_req(conn, pat) do
  #   key = pat || conn.resp_cookies["_pat"][:value]

  #   case RedisHelper.incrlm(key, 100) |> IO.inspect(label: "HF") do
  #     {:ok, _num} ->
  #       conn

  #     _ ->
  #       {:error, :limited, conn}
  #   end
  # end

  # defp final({:error, _, conn}), do: send_resp_gif(conn)
  # defp final(conn), do: conn

  def send_resp_gif(conn) do
    IO.inspect("fail")

    conn
    |> send_resp(200, @transparent_gif_buffer)
    |> halt()
  end
end
