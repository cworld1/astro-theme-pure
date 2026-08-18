FROM oven/bun:debian AS build

WORKDIR /web

RUN apt-get update && \
    apt-get install -y --no-install-recommends fontconfig && \
    rm -rf /var/lib/apt/lists/*
    
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

ENV ASTRO_TELEMETRY_DISABLED=1

EXPOSE 4321