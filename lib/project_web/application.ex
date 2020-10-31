defmodule ProjectWeb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec
    children = [
      # Start the Telemetry supervisor
      ProjectWebWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: ProjectWeb.PubSub},
      # Start the Endpoint (http/https)
      supervisor(ProjectWebWeb.Endpoint, []),
      # Start a worker by calling: ProjectWeb.Worker.start_link(arg)
      # {ProjectWeb.Worker, arg}
      supervisor(ProjectWeb.CassandraClient, []),
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ProjectWeb.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ProjectWebWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
