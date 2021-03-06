defmodule ProjectWebWeb.Router do
  use ProjectWebWeb, :router

  alias ProjectWebWeb.Plug.AccountPlug
  alias ProjectWebWeb.Plug.CollectPlug

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :account do
    plug AccountPlug
  end

  pipeline :collector do
    plug(:accepts, ["image/gif"])
    plug(CollectPlug)
  end

  scope "/api", ProjectWebWeb do
    pipe_through :api
    
    scope "/public" do
      post "/signup", PageController, :sign_up_account
      post "/login", PageController, :login_account
    end
    
    scope "/private" do
      pipe_through :account
      post "/create_app", PageController, :create_app
      get "/get_apps", PageController, :get_apps
      post "/remove_app", PageController, :remove_app
      get "/analytics", AnalyticsController, :get_analytics
      get "/account", PageController, :get_account
      post "/edit_profile", PageController, :edit_profile
      post "/edit_password", PageController, :edit_password
      post "/edit_app", PageController, :edit_app
    end
  end

  scope "/", ProjectWebWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/signup", PageController, :sign_up
    get "/login", PageController, :login

    pipe_through :account
    get "/dashboard", PageController, :single_page_app
    

  end

  scope "/", ProjectWebWeb do
    pipe_through :collector
    get "/collect", CollectorController, :collect
  end

  # Other scopes may use custom stacks.
  # scope "/api", ProjectWebWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: ProjectWebWeb.Telemetry
    end
  end
end
