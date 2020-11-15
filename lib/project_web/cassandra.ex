defmodule ProjectWeb.Cassandra do
  use GenServer

  def start_link([]) do
    GenServer.start_link(__MODULE__, [])
  end

  def init(_) do
    port = System.get_env("CASSANDRA_PORT") || "9042"
    host = System.get_env("CASSANDRA_HOST") || "analytics-cassandra"

    IO.inspect("#{host} #{port}")

    {:ok, conn} = Xandra.start_link(nodes: ["#{host}:#{port}"])
    |> IO.inspect(label: "ddd")
    #Xandra.execute!(conn, "USE projecta;") |> IO.inspect(label: "OK")
    {:ok, conn}
  end

  def execute(pid, statement, command) do
    GenServer.call(pid, {:execute, statement, command})
  end

  def execute_batch(pid, batch) do
    GenServer.call(pid, {:execute_batch, batch})
  end

  def run_command(pid, command) do
    GenServer.call(pid, {:command, command})
  end

  # SERVER

  def handle_call({:execute, statement, data}, _from, conn) do
    res = Xandra.execute(conn, statement, data)
    {:reply, res, conn}
  end

  def handle_call({:execute_batch, batch}, _from, conn) do
    res = Xandra.execute(conn, batch)
    {:reply, res, conn}
  end

  def handle_call({:command, command}, _from, conn) do
    res = command.(conn)
    {:reply, res, conn}
  end
end