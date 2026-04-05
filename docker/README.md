# 🐳 docker/

Dockerfiles, entrypoints, and service-specific config for all container targets.

## Dockerfiles

| File                  | Used by                  | Purpose                                                                                                                    |
| --------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile`          | `docker-compose.yml`     | Production image — multi-stage build; runs `drizzle-kit migrate` via entrypoint on start                                   |
| `Dockerfile.app-e2e`  | `docker-compose.e2e.yml` | E2E app image — full deps + build; `bun run start` only (no migrations; DB handles schema via SQL init scripts)            |
| `Dockerfile.e2e`      | `docker-compose.e2e.yml` | Playwright runner — official `mcr.microsoft.com/playwright` image (Node.js); avoids Bun ESM issues with `@playwright/test` |
| `Dockerfile.postgres` | `docker-compose.yml`     | Postgres base image override (if needed for extensions or locale)                                                          |

## Supporting files

| Path                     | Purpose                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `entrypoint.sh`          | Production container entrypoint — runs `drizzle-kit migrate` then `bun run start`; migrations are idempotent |
| `e2e/init/01_schema.sql` | Full DB schema (enum, tables, FK) for the e2e stack; run automatically by Postgres on container init         |
| `e2e/init/02_seed.sql`   | Admin + e2e test user with pre-hashed Argon2id passwords; run after schema on container init                 |
| `openpanel/Caddyfile`    | Caddy reverse-proxy config for the OpenPanel analytics stack                                                 |
| `signoz/`                | ClickHouse + OTel Collector configs for the SigNoz observability stack                                       |

## Rules

- `e2e/init/` SQL scripts must stay in sync with `backend/db/migrations/` — update both when a new migration is added
- Do not add runtime logic to `Dockerfile.app-e2e`; schema and seed belong in `e2e/init/`
- `entrypoint.sh` runs on every prod container start — keep it idempotent and fast
- The Playwright image must stay pinned (`v1.58.2-noble`) to match `@playwright/test` in `package.json`
- Local Docker defaults expose the app on `3210` and Postgres on `55432`
