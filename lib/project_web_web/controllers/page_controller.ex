defmodule ProjectWebWeb.PageController do
  use ProjectWebWeb, :controller
  alias ProjectWeb.Tools
  alias ProjectWeb.CassandraClient
  alias ProjectWeb.Guardian
  alias Accounts
  import Plug.Conn
  

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
    password = Bcrypt.hash_pwd_salt(params["password"]) 
    phone = params["phone"] 
    
    IO.inspect(phone, label: "test")
    add_account = "INSERT INTO projecta.accounts (id, email, first_name, last_name, password, phone_number) VALUES (uuid(), ?, ?, ?, ?, ?);"
    
    CassandraClient.execute(add_account, [
      {"text", email},
      {"text", first_name},
      {"text", last_name},
      {"text", password},
      {"text", phone}
    ]) 
    |> case do
      {:ok, _} -> 
        json(conn, %{success: true, message: "Singup success"})
      
      _ -> 
        conn
        |> put_status(422)
        |> json(%{success: false, message: "Create account error"})
        
    end
  end

  def login_account(conn, params) do
    email = params["user"]
    password = params["password"]

    query = "SELECT * FROM projecta.accounts WHERE email='#{email}' ALLOW FILTERING;"
    
    case CassandraClient.command(fn conn -> Xandra.execute(conn, query) end) do
      {:ok, %Xandra.Page{} = res} ->
        [hash] = Enum.to_list(res)
        user = %Accounts{email: hash["email"], id: hash["id"]}
        if Bcrypt.verify_pass(password, hash["password"]) do
          with {:ok, token, _claims} <- Guardian.encode_and_sign(user) do 
            user_name = hash["first_name"] <>" "<> hash["last_name"]  
            conn 
            |> assign(:user_name, user_name)
            |> put_resp_cookie("__jwt", token, http_only: true, max_age: 60 * 60 * 24 * 365)
            |> json(%{success: true, message: "Login success"})
          end
        else
          json(conn, %{success: false, message: "Login error"})
        end  
    end
  end

  def create_app(conn, _params) do
    IO.inspect(conn, label: "connnnnnnnn")
  end
end
