FROM oven/bun:debian AS build

WORKDIR /web

COPY package.json .

COPY bun.lock .

RUN bun install --frozen-lockfile

COPY . .

ENV ASTRO_TELEMETRY_DISABLED=1

EXPOSE 4321