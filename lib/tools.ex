defmodule ProjectWeb.Tools do
  @alphabet Enum.concat([?0..?9, ?A..?Z, ?a..?z])
  
  def is_empty?(val) when val in [nil, "null", "undefined", "", [], %{}], do: true
  def is_empty?(_), do: false

  def to_int(el) when el in [nil, "", "null", "undefined", "", [], %{}], do: 0

  def to_int(el) when is_bitstring(el) do
    case Integer.parse(el) do
      {num, ""} -> num
      {num, _} -> num
      _ -> 0
    end
  end

  def to_int(el) when is_integer(el), do: el
  def to_int(_), do: 0

  def str_to_bool(value) when is_boolean(value), do: value
  def str_to_bool("true"), do: true
  def str_to_bool("false"), do: false
  def str_to_bool(_), do: false

  def randstring(count) do
    # Technically not needed, but just to illustrate we're
    # relying on the PRNG for this in random/1
    :rand.seed(:exsplus, :os.timestamp())
    Stream.repeatedly(&random_char_from_alphabet/0)
    |> Enum.take(count)
    |> List.to_string()
  end
  defp random_char_from_alphabet() do
    Enum.random(@alphabet)
  end
  def shift_to_vn_time(utc_datetime, time_diff \\ 25200) do
    # time_diff = 25200
    utc_sec =
      NaiveDateTime.to_erl(utc_datetime)
      |> :calendar.datetime_to_gregorian_seconds()

    :calendar.gregorian_seconds_to_datetime(utc_sec + time_diff)
    |> NaiveDateTime.from_erl!()
  end
end