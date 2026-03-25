# ---- Builder stage ----
# Installs all deps and builds the frontend into dist/
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# ---- Runner stage ----
# Lean production image — only what's needed to run the server
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Backend source (Bun runs TypeScript directly — no compile step needed)
COPY tsconfig.json ./
COPY backend/ ./backend/

# Built frontend assets served from dist/ in production
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bun", "backend/server.ts"]

# vim: set filetype=dockerfile :
