# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :project_web, ProjectWebWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Ui2iyUIadlEFjd9T6cdIOzyPtgMx43MzZfqpStRoeRaHBkWbLwNo7U+X2uRtqfWx",
  render_errors: [view: ProjectWebWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: ProjectWeb.PubSub,
  live_view: [signing_salt: "ocSq8yOX"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :project_web, ProjectWeb.Guardian,
       issuer: "project_web",
       secret_key: "KngK5GkbT7VQvTx1SbjQIF4C9j+PuspMDvH0uoC+AFX9xiY17ztiP3J0bQfd7nX4"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
