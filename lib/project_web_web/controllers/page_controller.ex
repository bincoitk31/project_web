defmodule ProjectWebWeb.PageController do
  use ProjectWebWeb, :controller
  alias ProjectWeb.Tools
  alias ProjectWeb.CassandraClient

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def sign_up(conn, _params) do
    render conn, "index.html",
      layout: {ProjectWebWeb.LayoutView, "signup.html"}
  end

  def single_page_app(conn, _params) do
    render conn, "index.html",
      layout: {ProjectWebWeb.LayoutView, "dashboard.html"}
  end

  def login(conn, _params) do
    render conn, "index.html",
      layout: {ProjectWebWeb.LayoutView, "login.html"}
  end

  def sign_up_account(conn, params) do
    IO.inspect(params, label: "paramssss")
    id = Tools.randstring(24)
    email = params["email"]
    first_name = params["first_name"]
    last_name = params["last_name"]
    password = params["password"]
    phone = params["phone"]

    IO.inspect(id, label: "test")
    add_account = "INSERT INTO accounts (id, email, first_name, last_name, password, phone) VALUES (?, ?, ?, ?, ?, ?);"
    
    CassandraClient.execute(add_account, [
      {"text", id},
      {"text", email},
      {"text", first_name},
      {"text", last_name},
      {"text", password},
      {"int", phone}
    ])
    |> IO.inspect(label: "ok")
  end
end
