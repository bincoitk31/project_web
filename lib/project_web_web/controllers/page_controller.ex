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

  def create_app(conn, params) do
    IO.inspect(conn, label: "connnnnnnnn")
    id = Tools.randstring(12)
    domain = params["domain"]
    name = params["name"]
    removed = false
    account_id = conn.assigns.id_user
    add_new_app = "INSERT INTO projecta.apps (id, domain, name, removed, account_id) VALUES (?, ?, ?, ?, ?);"
    CassandraClient.execute(add_new_app, [
      {"text", id},
      {"text", domain},
      {"text", name},
      {"boolean", removed},
      {"uuid", account_id}
    ])
    |> IO.inspect(label: "insert success")

    
    query_apps = "SELECT * FROM projecta.apps WHERE account_id=#{account_id} ALLOW FILTERING;"
    
    case CassandraClient.command(fn conn -> Xandra.execute(conn, query_apps) end) do
      {:ok, %Xandra.Page{} = res} -> 
        apps = Enum.to_list(res)
        IO.inspect(apps, label: "apps")
        json(conn, %{success: true, apps: apps})
      
      {:err, _} ->
        conn
        |> put_status(422)
        |> json(%{success: false, message: "err insert new app"})

      end
    
  end

  def get_apps(conn, params) do
    IO.inspect(conn.assigns.id_user, label: "id_user")
    account_id = conn.assigns.id_user
    query = "SELECT * FROM projecta.apps WHERE account_id=#{account_id} ALLOW FILTERING;"

    case CassandraClient.command(fn conn -> Xandra.execute(conn, query) end) do
      {:ok, %Xandra.Page{} = res} -> 
        apps = Enum.to_list(res)
        IO.inspect(apps, label: "apps")
        json(conn, %{success: true, apps: apps})
      {:err, _} ->
        conn
        |> put_status(422)
        |> json(%{success: false, message: "err query apps"})

    end
  end

  def remove_app(conn, %{"id" => id}=params) do
    IO.inspect(id, label: "binneohihihs")
    
    delete = "DELETE FROM projecta.apps WHERE id='#{id}' IF EXISTS;"
    case CassandraClient.command(fn conn -> Xandra.execute(conn, delete) end) do
      {:ok, _} ->
        json(conn, %{success: true, message: "Delete success"})
    end
  end

  def collect(conn, params) do
    IO.inspect(params, label: "paramss")
  end

  def get_account(conn, _) do
    account_id = conn.assigns.id_user
    query = "SELECT * FROM projecta.accounts WHERE id=#{account_id} ALLOW FILTERING;"
    
    case CassandraClient.command(fn conn -> Xandra.execute(conn, query) end) do
      {:ok, %Xandra.Page{} = res} -> 
        account = Enum.to_list(res)
        json(conn, %{success: true, account: account})

      {:err, _} ->
        conn
        |> put_status(422)
        |> json(%{success: false, message: "err query account"})
    end
  end

  def edit_profile(conn, params) do
    account_id = conn.assigns.id_user
    first_name = params["firstname"]
    last_name = params["lastname"]
    phone_number = params["phone_number"]
    email = params["email"]

    edit = "UPDATE projecta.accounts SET last_name='#{last_name}', first_name='#{first_name}', phone_number='#{phone_number}' WHERE id=#{account_id} AND email ='#{email}';" 
    
    case CassandraClient.command(fn conn -> Xandra.execute(conn, edit) end) do
      {:ok, _} ->
        json(conn, %{success: true, message: "Edit success"})
    end
  end

  def edit_password(conn, params) do
    IO.inspect(params, label: "pasramsmmmmmmmmmm")
    account_id = conn.assigns.id_user
    password = Bcrypt.hash_pwd_salt(params["password"])
    email = params["email"]

    edit = "UPDATE projecta.accounts SET password='#{password}' WHERE id=#{account_id} AND email ='#{email}';"
    case CassandraClient.command(fn conn -> Xandra.execute(conn, edit) end) do
      {:ok, _} ->
        json(conn, %{success: true, message: "Edit password success"})
    end
  end

end
