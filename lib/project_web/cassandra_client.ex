defmodule ProjectWeb.CassandraClient do
  use Supervisor

  alias ProjectWeb.Cassandra

  def start_link() do
    Supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    pool_size = if System.get_env("MIX_ENV") == "prod", do: 10, else: 5

    pool_options = [
      {:name, {:local, :cassandra_pool}},
      worker_module: Cassandra,
      size: pool_size,
      max_overflow: pool_size * 2
    ]

    children = [
      :poolboy.child_spec(:cassandra_pool, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end

  def execute(statement, data) do
    :poolboy.transaction(:cassandra_pool, fn pid ->
      Cassandra.execute(pid, statement, data)
    end)
  end

  def execute_batch(batch) do
    :poolboy.transaction(:cassandra_pool, fn pid ->
      Cassandra.execute_batch(pid, batch)
    end)
  end

  def command(command) do
    :poolboy.transaction(:cassandra_pool, fn pid ->
      Cassandra.run_command(pid, command)
    end)
  end
end