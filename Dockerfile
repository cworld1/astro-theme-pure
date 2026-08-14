FROM oven/bun:debian AS build

WORKDIR /web

COPY package.json .

COPY bun.lock .

RUN bun install --frozen-lockfile

COPY . .

RUN bun astro telemetry disable && bun run build

FROM oven/bun:debian AS dev

WORKDIR /web

COPY --from=build /web/node_modules ./node_modules

COPY --from=build /web/dist /dist

EXPOSE 4321