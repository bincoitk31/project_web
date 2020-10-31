defmodule ProjectWebWeb.Plug.AccountPlug do
  def init(opts), do: opts

  def call(conn, _) do
    if (true) do
      conn
    else
      # reject(conn)
    end
  end

  # def reject(conn) do
  #   conn
  #   |> send_reps(401, "Unauthorized!")
  #   |> halt()
  # end
end