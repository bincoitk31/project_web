defmodule ProjectWebWeb.CollectorController do
  use ProjectWebWeb, :controller
  alias ProjectWeb.{Tools, CassandraClient}

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

  defp get_referrer(referrer) do
    ref_list = ["facebook", "google", "twitter", "messenger"]

    detect =
      for el <- ref_list do
        try do
          reg = Regex.compile!("^https?:\/\/([^\/]+\.)?#{el}\.com(\/|$)", "i")
          if Regex.match?(reg, referrer), do: el, else: nil
        rescue
          _ -> false
        end
      end
      |> Panex.Collection.compact()

    source = Enum.at(detect, 0) || "_"

    if Tools.is_empty?(referrer), do: "direct", else: source
  end


  defp get_domain(location, scheme) do
    scheme = scheme <> "//"

    if scheme && String.slice(location, 0, String.length(scheme)) == scheme do
      [domain | path] =
        String.slice(location, String.length(scheme), String.length(location))
        |> String.split("/")

      {domain, "/" <> Enum.join(path, "/")}
    else
      nil
    end
  end


  defp get_user_id(key) do
    String.split(key, ".") |> List.last()
  end

  def collect(conn, params) do
    user_agent = for({"user-agent", data} <- conn.req_headers, do: data) |> List.first()
    client_ip = for({"x-real-ip", ip} <- conn.req_headers, do: ip) |> List.first()

    user_hour = conn.assigns.user_hour |> String.split(".") |> List.last() |> IO.inspect(label: "die")
    
    d_m = 60 * 60 * 24

    stats = %{
      # version
      "_v" => params["_v"] || "nil",
      # location
      "dl" => params["dl"] || "nil",
      # title
      "dt" => params["dt"] || "nil",
      # scheme
      "sc" => params["sc"] || "nil",
      # analytic id
      "tid" => params["tid"] || "nil",
      # time stamp
      "ts" => params["ts"] || "nil",
      # view port
      "vp" => params["vp"] || "nil",
      # user agent
      "ua" => user_agent || "nil",
      # ip
      "ip" => client_ip || "nil",
      # screen
      "sr" => params["sr"] || "nil",
      # referrer
      "fr" => (!Tools.is_empty?(params["fr"]) && params["fr"]) || "nil"
    }

    now = DateTime.utc_now() |> DateTime.to_unix()

    Task.async(fn ->
      key = "ana.#{now}.#{user_hour}" |> IO.inspect(label: "KEYs")

      {domain, path} = get_domain(stats["dl"], stats["sc"])

      # inst =
      #   "UPDATE projecta.count_by_pages SET count = count + 1 WHERE path = ? AND domain = ? AND tid = ? AND day = ?"

      [_date, min] =
        DateTime.utc_now()
        |> Tools.shift_to_vn_time()
        |> NaiveDateTime.to_string()
        |> String.slice(0..-4)
        |> String.split(" ")
        |> IO.inspect()

      date = Date.utc_today()

      # browser = if Browser.device_type(stats["ua"]) == :desktop, do: "desktop", else: "mobile"

      browser = Atom.to_string(Browser.device_type(stats["ua"]))

      browser =
        if browser not in ["desktop", "mobile", "tablet"] do
          "desktop"
        else
          browser
        end

      # CassandraClient.execute(inst, [
      #   {"text", path},
      #   {"text", domain},
      #   {"text", stats["tid"]},
      #   {"date", date}
      # ])
      # |> IO.inspect()

      dinst =
        "UPDATE projecta.count_by_device SET #{browser}_count = #{browser}_count +1 WHERE domain = ? AND tid = ? AND day = ?"

      CassandraClient.execute(dinst, [
        {"text", domain},
        {"text", stats["tid"]},
        {"date", date}
      ])
      |> IO.inspect()

      dayinst =
        "INSERT INTO projecta.unique_user_by_day (domain, day, tid, user_id) VALUES (?, ?, ?, ?)"

      CassandraClient.execute(dayinst, [
        {"text", domain},
        {"date", date},
        {"text", stats["tid"]},
        {"text", get_user_id(key)}
      ])
      |> IO.inspect()

      domaininst =
        "INSERT INTO projecta.unique_user_by_domain (domain, tid, user_id) VALUES (?, ?, ?)"

      CassandraClient.execute(domaininst, [
        {"text", domain},
        {"text", stats["tid"]},
        {"text", get_user_id(key)}
      ])
      |> IO.inspect()

      referrerinst =
        "UPDATE projecta.count_by_referrer SET count = count + 1 WHERE domain = ? AND tid = ? AND day = ? AND referrer = ?"

      referrer = get_referrer(params["fr"])

      CassandraClient.execute(referrerinst, [
        {"text", domain},
        {"text", stats["tid"]},
        {"date", date},
        {"text", referrer}
      ])
      |> IO.inspect(label: "||| REFERRER")

      reqbyday =
        "UPDATE projecta.request_count_by_day SET count = count + 1 WHERE domain = ? AND tid = ? and day = ?"

      CassandraClient.execute(reqbyday, [
        {"text", domain},
        {"text", stats["tid"]},
        {"date", date}
      ])
      |> IO.inspect(label: "||| Request count by day")

      # user by hour
      time = DateTime.utc_now() |> DateTime.to_time()
      hour = time.hour
      user_by_hour =
        "INSERT INTO projecta.unique_user_by_hour (domain, day, hour, tid, user_id) VALUES (?, ?, ?, ?, ?)"

      CassandraClient.execute(user_by_hour, [
        {"text", domain},
        {"date", date},
        {"int", hour},
        {"text", stats["tid"]},
        {"text", get_user_id(key)}
      ])

      # request by hour 
      res_by_hour =
        "UPDATE projecta.request_count_by_hour SET count = count + 1 WHERE domain = ? AND tid = ? and day = ? AND hour = ?"

      CassandraClient.execute(res_by_hour, [
        {"text", domain},
        {"text", stats["tid"]},
        {"date", date},
        {"int", hour}
      ])

      # referrer by hour
      ref_by_hour =
        "UPDATE projecta.count_referrer_by_hour SET count = count + 1 WHERE domain = ? AND tid = ? AND day = ? AND referrer = ? AND hour = ?"

      referrer = get_referrer(params["fr"])

      CassandraClient.execute(ref_by_hour, [
        {"text", domain},
        {"text", stats["tid"]},
        {"date", date},
        {"text", referrer},
        {"int", hour}
      ])

      # device by hour
      device_by_hour =
        "UPDATE projecta.count_device_by_hour SET #{browser}_count = #{browser}_count +1 WHERE domain = ? AND tid = ? AND day = ? AND hour = ?"

      CassandraClient.execute(device_by_hour, [
        {"text", domain},
        {"text", stats["tid"]},
        {"date", date},
        {"int", hour}
      ])

      # unique user online
      date_now = DateTime.utc_now() |> DateTime.to_unix(:millisecond)
      user_id = get_user_id(key)

      unique_user_online =
        "INSERT INTO projecta.unique_user_online (domain, tid, user_id, date, timestamp) VALUES (?, ?, ?, ?, ?)"

      CassandraClient.execute(unique_user_online, [
        {"text", domain},
        {"text", stats["tid"]},
        {"text", user_id},
        {"date", date},
        {"timestamp", date_now}
      ])
      |> IO.inspect(label: "hichihihihi")
    end)

    conn
    |> put_resp_header("Content-Type", "image/gif")
    |> send_resp(200, @transparent_gif_buffer)
  rescue
    trace ->
      IO.inspect(trace)
      send_resp(conn, 200, @transparent_gif_buffer)
  end

end