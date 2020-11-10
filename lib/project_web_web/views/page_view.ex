defmodule ProjectWebWeb.PageView do
  use ProjectWebWeb, :view

  def render("jwt.json", %{jwt: jwt}) do
    %{jwt: jwt}
  end
end
