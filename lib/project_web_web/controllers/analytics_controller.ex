defmodule ProjectWebWeb.AnalyticsController do
  use ProjectWebWeb, :controller

  alias ProjectWeb.CassandraClient
  alias ProjectWeb.Tools
  import Plug.Conn

  def get_analytics(conn,%{"tid" => tid, "domain" => domain, "spec" => "unique_user_online"} = params) do
    IO.inspect(params, label: "params")
    date_now = DateTime.utc_now() |> DateTime.to_unix(:millisecond)
    IO.inspect(date_now, label: "date_now")
    max_date_online = date_now - 5 * 60 * 1000
        IO.inspect(max_date_online,label: "Oke ban nhe")
    query_unique_user_online =
      "SELECT COUNT(*) FROM projecta.unique_user_online WHERE tid = '#{tid}' and timestamp >= '#{
        max_date_online
      }' ALLOW FILTERING"

    with {:ok, %Xandra.Page{} = unique_user_online} <-
           CassandraClient.command(fn conn ->
             Xandra.execute(conn, query_unique_user_online)
           end) do
      [unique_user_online] = Enum.to_list(unique_user_online)
      IO.inspect(unique_user_online ,label: "onl")
      count_user_online = unique_user_online["count"] || 0

      json(conn, %{unique_user_online: count_user_online})
    end
  end

  def get_analytics(conn, %{"tid" => tid, "domain" => domain, "period" => period} = params) do
    now = Date.utc_today()
    IO.inspect(label: "khong co periode")
    # hour range in date
    hour_range =
      if !Tools.is_empty?(params["hour_range"]),
        do: Jason.decode!(params["hour_range"]),
        else: %{}

    date_hour =
      if !Tools.is_empty?(hour_range["date_hour"]),
        do: NaiveDateTime.from_iso8601!(hour_range["date_hour"]) |> NaiveDateTime.to_date(),
        else: now
    
    start_hour =
      if !Tools.is_empty?(hour_range["start_hour"]),
        do: hour_range["start_hour"],
        else: 0

    end_hour =
      if !Tools.is_empty?(hour_range["end_hour"]),
        do: hour_range["end_hour"],
        else: 23

    # date range
    date_range =
      if !Tools.is_empty?(params["date_range"]),
        do: Jason.decode!(params["date_range"]),
        else: %{}

    start_time =
      if !Tools.is_empty?(date_range["start_time"]),
        do: NaiveDateTime.from_iso8601!(date_range["start_time"]) |> NaiveDateTime.to_date(),
        else: now
    
    end_time =
      if !Tools.is_empty?(date_range["end_time"]),
        do: NaiveDateTime.from_iso8601!(date_range["end_time"]) |> NaiveDateTime.to_date(),
        else: now
    
    now =
      case period do
        "hour_range" -> end_hour
        "date_range" -> end_time
        _ -> now
      end
    |> IO.inspect(label: "now")
    peri =
      case period do
        "hour_range" -> start_hour
        "date_range" -> start_time
        "day" -> now
        "week" -> Timex.shift(now, days: -6)
        "month" -> Timex.shift(now, months: -1)
        _ -> now
      end
    |> IO.inspect(label: "peri")
    now = if is_integer(now), do: now, else: Date.to_string(now)
    peri = if is_integer(peri), do: peri, else: Date.to_string(peri)

    # page_view_query =
    #   case period do
    #     "hour_range" ->
    #       "SELECT * FROM projecta.count_page_by_hour WHERE tid = '#{tid}' AND hour >= #{peri} AND hour <= #{
    #         now
    #       } and day = '#{date_hour}' ALLOW FILTERING;"

    #     _ ->
    #       "SELECT * FROM projecta.count_by_pages WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
    #         now
    #       }';"
    #   end

    browser_query =
      case period do
        "hour_range" ->
          "SELECT * FROM projecta.count_device_by_hour WHERE tid = '#{tid}' AND hour >= #{peri} AND hour <= #{
            now
          } AND day = '#{date_hour}' ALLOW FILTERING;"

        _ ->
          "SELECT * FROM projecta.count_by_device WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
            now
          }';"
      end

    unique_by_day =
      case period do
        "hour_range" ->
          "SELECT COUNT(*) FROM projecta.unique_user_by_hour WHERE tid = '#{tid}' AND hour >= #{peri} AND hour <= #{
            now
          } AND day = '#{date_hour}' ALLOW FILTERING;"

        _ ->
          "SELECT COUNT(*) FROM projecta.unique_user_by_day WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
            now
          }';"
      end

    unique_by_week =
      case period do
        "hour_range" ->
          "SELECT * FROM projecta.unique_user_by_hour WHERE tid = '#{tid}' AND hour >= #{peri} AND hour <= #{
            now
          } AND day = '#{date_hour}' ALLOW FILTERING;"

        _ ->
          "SELECT * FROM projecta.unique_user_by_day WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
            now
          }';"
      end

    req_count_by_day =
      case period do
        "hour_range" ->
          "SELECT * FROM projecta.request_count_by_hour WHERE tid = '#{tid}' AND hour >= #{peri} AND hour <= #{
            now
          } AND day = '#{date_hour}' ALLOW FILTERING;"

        _ ->
          "SELECT * FROM projecta.request_count_by_day WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
            now
          }';"
      end

    referrer_query =
      case period do
        "hour_range" ->
          "SELECT * FROM projecta.count_referrer_by_hour WHERE tid = '#{tid}' AND hour >= #{peri} AND hour <= #{
            now
          } AND day = '#{date_hour}' ALLOW FILTERING;"

        _ ->
          "SELECT * FROM projecta.count_by_referrer WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
            now
          }';"
      end

    date_range_query =
      case period do
        "hour_range" ->
          Enum.to_list((start_hour - 7)..(end_hour - 7))
          |> Enum.map(fn d ->
            q =
              "SELECT COUNT(*) FROM projecta.unique_user_by_hour WHERE tid = '#{tid}' AND hour = #{d} AND day = '#{
                date_hour
              }' ALLOW FILTERING;"

            case CassandraClient.command(fn conn -> Xandra.execute(conn, q) end)
                 |> IO.inspect(label: "iiiiiiiiiiiii") do
              {:ok, %Xandra.Page{} = res} ->
                [count] = Enum.to_list(res)
                Map.put(count, "date", "#{d + 7}:00")

              _ ->
                nil
            end
          end)
          |> Enum.reject(&(!&1))

        "date_range" ->
          q =
            "SELECT * FROM projecta.unique_user_by_day WHERE tid = '#{tid}' AND day >= '#{peri}' AND day <= '#{
              now
            }'"

          case CassandraClient.command(fn conn -> Xandra.execute(conn, q) end) do
            {:ok, %Xandra.Page{} = res} ->
              rows = Enum.to_list(res)

              {rows, _} =
                Enum.reduce(rows, {[], rows}, fn el, acc ->
                  {a, rest} = acc
                  rest = List.delete(rest, 0)
                  existed = Enum.find(a, &(&1["date"] == el["day"]))
                  count = if existed, do: existed["count"] + 1, else: 1
                  a = a -- [existed]
                  {a ++ [%{"date" => el["day"], "count" => count}], rest}
                end)

              rows

            _ ->
              []
          end

        "week" ->
          Enum.to_list(0..6)
          |> Enum.map(fn el ->
            d =
              Date.utc_today()
              |> Timex.shift(days: -1 * el)
              |> Date.to_string()

            q =
              "SELECT COUNT(*) FROM projecta.unique_user_by_day WHERE tid = '#{tid}' AND day = '#{d}'"

            case CassandraClient.command(fn conn -> Xandra.execute(conn, q) end) do
              {:ok, %Xandra.Page{} = res} ->
                [count] = Enum.to_list(res)
                Map.put(count, "date", d)

              _ ->
                nil
            end
          end)
          |> Enum.reject(&(&1 == nil))
          |> Enum.reverse()
          |> IO.inspect(label: "DATEW RANGE QUERYR")

        "month" ->
          Enum.to_list(0..30)
          |> Enum.map(fn el ->
            d =
              Date.utc_today()
              |> Timex.shift(days: -1 * el)
              |> Date.to_string()

            q =
              "SELECT COUNT(*) FROM projecta.unique_user_by_day WHERE tid = '#{tid}' AND day = '#{d}'"

            case CassandraClient.command(fn conn -> Xandra.execute(conn, q) end) do
              {:ok, %Xandra.Page{} = res} ->
                [count] = Enum.to_list(res)

                Map.put(count, "date", d)
                |> Map.put("day", d)

              _ ->
                nil
            end
          end)
          |> Enum.reject(&(&1 == nil))
          |> Enum.reverse()
        
        _ -> IO.inspect(label: "haha")
      end

    req_count_by_week =
      Enum.to_list(0..30)
      |> Enum.map(fn el ->
        d =
          Date.utc_today()
          |> Timex.shift(days: -1 * el)
          |> Date.to_string()

        q =
          "SELECT SUM(count) as count FROM projecta.request_count_by_day WHERE tid = '#{tid}' AND day = '#{
            d
          }' order by day DESC;"

        case CassandraClient.command(fn conn -> Xandra.execute(conn, q) end) do
          {:ok, %Xandra.Page{} = res} ->
            [count] = Enum.to_list(res)
            Map.put(count, "date", d)

          _ ->
            nil
        end
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.reverse()
      |> IO.inspect(label: "count by week")

    req_count_by_date_range =
      case CassandraClient.command(fn conn -> Xandra.execute(conn, req_count_by_day) end) do
        {:ok, %Xandra.Page{} = res} ->
          reqs =
            Enum.to_list(res)
            |> Enum.map(&Map.take(&1, ["count", "day"]))
            |> Enum.reduce(%{}, fn el, acc ->
              key = Date.to_string(el["day"])
              count = el["count"]
              acc_count = if acc[key], do: acc[key] + count, else: count
              Map.put(acc, key, acc_count)
            end)

          for {k, v} <- reqs, do: %{"day" => k, "count" => v}

        _ ->
          nil
      end

    req_count_by_hour_range =
      Enum.to_list((start_hour - 7)..(end_hour - 7))
      |> Enum.map(fn d ->
        q =
          "SELECT SUM(count) AS count FROM projecta.request_count_by_hour WHERE tid = '#{tid}' AND hour = #{
            d
          } AND day = '#{date_hour}' ALLOW FILTERING;"

        case CassandraClient.command(fn conn -> Xandra.execute(conn, q) end) do
          {:ok, %Xandra.Page{} = res} ->
            [count] = Enum.to_list(res)

            Map.put(count, "date", "#{d + 7}:00")
        end
      end)

    # YOU CAN GET RESULT in just ONE SINGLE READ QUERY WITH GROUP BY
    #     uubw_query =
    #       "SELECT day, domain, COUNT(*) as count FROM projecta.unique_user_by_day WHERE day >= '#{week}' AND day <= '#{
    #         now
    #       }' GROUP BY day, domain ALLOW FILTERING;"
    #
    #     unique_user_by_week =
    #       CassandraClient.command(fn conn -> Xandra.execute(conn, uubw_query) end)

    # get user online 5m before
    date_now = DateTime.utc_now() |> DateTime.to_unix(:millisecond)
    max_date_online = date_now - 5 * 60 * 1000

    query_unique_user_online =
      "SELECT COUNT(*) FROM projecta.unique_user_online WHERE tid = '#{tid}' and timestamp >= '#{
        max_date_online
      }' ALLOW FILTERING"

    with {:ok, %Xandra.Page{} = devices} <-
           CassandraClient.command(fn conn -> Xandra.execute(conn, browser_query) end)
           |> IO.inspect(label: "devices"),
         {:ok, %Xandra.Page{} = ubd} <-
           CassandraClient.command(fn conn ->
             Xandra.execute(conn, unique_by_day) |> IO.inspect(label: "ubd")
           end),
         {:ok, %Xandra.Page{} = ubw} <-
           CassandraClient.command(fn conn ->
             Xandra.execute(conn, unique_by_week) |> IO.inspect(label: "ubw")
           end),
         {:ok, %Xandra.Page{} = req_count_by_day} <-
           CassandraClient.command(fn conn ->
             Xandra.execute(conn, req_count_by_day) |> IO.inspect(label: "cbd")
           end),
         {:ok, %Xandra.Page{} = referrers} <-
           CassandraClient.command(fn conn ->
             Xandra.execute(conn, referrer_query) |> IO.inspect(label: "ref")
           end),
         {:ok, %Xandra.Page{} = unique_user_online} <-
           CassandraClient.command(fn conn ->
             Xandra.execute(conn, query_unique_user_online)
           end) do
      # pv =
      #   Enum.to_list(pvbd)
      #   |> distinct_count("path", %{})
      #   |> Map.to_list()
      #   |> Enum.sort(fn {_, p}, {_, n} -> n <= p end)
      #   |> Enum.slice(0..9)
      #   |> Enum.map(fn {k, v} -> [k, v] end)

      devices_count =
        Enum.to_list(devices)
        |> Enum.reduce(%{"desktop_count" => 0, "mobile_count" => 0, "tablet_count" => 0}, fn x,
                                                                                             acc ->
          update_in(acc, ["desktop_count"], &(&1 + (x["desktop_count"] || 0)))
          |> update_in(["mobile_count"], &(&1 + (x["mobile_count"] || 0)))
          |> update_in(["tablet_count"], &(&1 + (x["tablet_count"] || 0)))
        end)

      refs = Enum.to_list(referrers)

      IO.inspect(refs, label: "request count by day")

      reqs =
        Enum.to_list(req_count_by_day)
        |> Enum.map(&Map.take(&1, ["count", "day"]))
        |> Enum.reduce(%{}, fn el, acc ->
          key = Date.to_string(el["day"])
          count = el["count"]
          acc_count = if acc[key], do: acc[key] + count, else: count
          Map.put(acc, key, acc_count)
        end)

      reqs = for {k, v} <- reqs, do: %{"day" => k, "count" => v}

      week_days =
        Enum.to_list(0..6)
        |> Enum.map(fn el ->
          Timex.shift(Date.utc_today(), days: -1 * el) |> Date.to_string()
        end)

      referrers =
        week_days
        |> Enum.sort(fn p, n -> p <= n end)
        |> Enum.map(fn el ->
          data = %{
            "facebook" =>
              Enum.find(refs, fn ref ->
                ref["referrer"] == "facebook" && Date.to_string(ref["day"]) == el
              end),
            "google" =>
              Enum.find(refs, fn ref ->
                ref["referrer"] == "google" && Date.to_string(ref["day"]) == el
              end),
            "messenger" =>
              Enum.find(refs, fn ref ->
                ref["referrer"] == "messenger" && Date.to_string(ref["day"]) == el
              end),
            "direct" =>
              Enum.find(refs, fn ref ->
                ref["referrer"] == "direct" && Date.to_string(ref["day"]) == el
              end),
            "others" =>
              Enum.find(refs, fn ref ->
                ref["referrer"] == "_" && Date.to_string(ref["day"]) == el
              end)
          }

          %{
            "day" => el,
            "data" => data
          }
        end)

      merge_reqs =
        case period do
          "hour_range" ->
            req_count_by_hour_range

          "date_range" ->
            req_count_by_date_range

          "week" ->
            week_days
            |> Enum.sort(fn p, n -> p <= n end)
            |> Enum.map(fn el ->
              daystat = Enum.find(reqs, fn atom -> atom["day"] == el end)

              %{
                "day" => el,
                "count" => daystat["count"] || 0
              }
            end)

          "month" ->
            req_count_by_week
        end

      ubd = Enum.to_list(ubd) |> List.first() |> Map.put("date", now)

      [unique_user_online] = Enum.to_list(unique_user_online)
      count_user_online = unique_user_online["count"] || 0

      json(conn, %{
        success: true,
        # page_views_by_day: pv,
        devices: devices_count,
        unique_user_by_week: date_range_query,
        unique_user_by_day: ubd,
        request_count_by_day: merge_reqs,
        request_source: refs,
        unique_user_online: count_user_online,
        referrers: referrers
      })
    else
      reason ->
        IO.inspect(reason, label: "FAILED REASON")

        conn
        |> put_status(422)
        |> json(%{success: false})
    end
  end

  defp distinct_count([], _field, acc), do: acc

  defp distinct_count([h | t], field, acc) do
    nacc = Map.put(acc, h[field], h["count"] + (acc[h[field]] || 0))
    distinct_count(t, field, nacc)
  end

  def clean_unique_user_online(conn, params) do
    date = DateTime.utc_now() |> Timex.shift(days: -1) |> DateTime.to_date()
    query = "DELETE FROM unique_user_online WHERE date = '#{date}'"

    CassandraClient.execute(query, [])
    |> case do
      {:ok, _} ->
        json(conn, %{success: true, message: "Delete unique_user_online success"})

      _ ->
        conn
        |> put_status(422)
        |> json(%{success: false, message: "Delete unique_user_online error"})
    end
  end
end
