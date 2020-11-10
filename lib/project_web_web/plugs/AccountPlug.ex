defmodule ProjectWebWeb.Plug.AccountPlug do
  alias Accounts
  alias ProjectWeb.Guardian
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    IO.inspect(conn.assigns, label: "tokennnnn")
    token = conn.cookies["__jwt"]
    case Guardian.decode_and_verify(token) do
      {:ok, claims} ->
        Plug.Conn.assign(conn, :id_user, claims["sub"])
      {:error, _reason} ->
        reject(conn)
    end
  end

  def reject(conn) do
    conn
    |> send_resp(401, "Unauthorized!")
    |> halt()
  end
end