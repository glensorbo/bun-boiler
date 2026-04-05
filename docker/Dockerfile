# ---- Builder stage ----
# Installs all deps and builds the frontend into dist/
FROM oven/bun:1 AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS build

WORKDIR /app

COPY . .

# BUN_PUBLIC_* vars are inlined into the frontend bundle at build time by
# Bun's bundler. They must be declared as ARG and re-exported as ENV here so
# that `bun run build` can embed them. Pass them via `build.args` in
# docker-compose.yml (they read from the host .env automatically).
ARG BUN_PUBLIC_OPENPANEL_CLIENT_ID
ARG BUN_PUBLIC_OPENPANEL_API_URL
ARG BUN_PUBLIC_OTEL_SERVICE_NAME
ENV BUN_PUBLIC_OPENPANEL_CLIENT_ID=${BUN_PUBLIC_OPENPANEL_CLIENT_ID}
ENV BUN_PUBLIC_OPENPANEL_API_URL=${BUN_PUBLIC_OPENPANEL_API_URL}
ENV BUN_PUBLIC_OTEL_SERVICE_NAME=${BUN_PUBLIC_OTEL_SERVICE_NAME}

RUN bun run build

# ---- Runner stage ----
FROM oven/bun:1.3.10-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3210

COPY package.json bun.lock ./
# Full install (not --production) so drizzle-kit is available for migrations
# at startup. The size cost is small compared to the reliability benefit.
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

EXPOSE 3210

CMD ["sh", "docker/entrypoint.sh"]

# vim: set filetype=dockerfile :
