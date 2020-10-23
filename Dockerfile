FROM elixir:1.10.4-alpine

RUN apk update
RUN apk add inotify-tools
RUN apk add build-base
RUN apk add git

RUN mix local.hex --force
RUN mix archive.install hex phx_new 1.5.6

RUN apk add nodejs
RUN apk add npm

WORKDIR /app
COPY mix.exs /app/
RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix deps.get && \
    mix deps.compile

COPY . /app

