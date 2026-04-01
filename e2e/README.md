# 🎭 E2E Tests

End-to-end tests using [Playwright](https://playwright.dev/). Tests run against the live dev server (auto-started) or a URL you provide.

## Running Tests

```bash
# API tests only — no browser required, works in WSL / Docker / CI
bun e2e

# Browser tests — requires Chromium (see setup below)
bun e2e:browser

# All tests (API + browser)
bun e2e:all

# Interactive UI mode
bun e2e:ui

# Debug mode (step through tests)
bun e2e:debug

# Against an already-running server
E2E_BASE_URL=http://localhost:3210 bun e2e
```

## Projects

| Project   | Command           | Tests                               | Needs browser? |
| --------- | ----------------- | ----------------------------------- | -------------- |
| `api`     | `bun e2e`         | `e2e/api/**`, `healthcheck.spec.ts` | ❌ No          |
| `browser` | `bun e2e:browser` | `e2e/frontend.spec.ts`              | ✅ Yes         |

## Structure

```
e2e/
├── api/
│   ├── auth.spec.ts       # Auth controller — login, logout, refresh, create-user, change-password
│   └── user.spec.ts       # User controller — GET /api/user, GET /api/user/:id
├── fixtures/
│   └── index.ts           # Custom fixtures: authedRequest, testUser
├── seed-test-user.ts      # Bun script — seeds test user directly to DB
├── global-setup.ts        # Runs seed-test-user.ts, logs in, saves token to .auth/user.json
├── healthcheck.spec.ts    # Verifies GET /healthcheck returns 200 OK
└── frontend.spec.ts       # SPA loads, #root mounts, unknown routes fall back to SPA
```

## Authentication

Global setup runs once before all tests:

1. **Seeds** the E2E test user directly to the DB (idempotent — skips if already exists)
2. **Logs in** via `POST /api/auth/login` to get a Bearer token
3. **Saves** `{ token, userId, email }` to `.auth/user.json`

Tests that need auth import from `../fixtures`:

```ts
import { test, expect } from '../fixtures';

test('returns users list', async ({ authedRequest, testUser }) => {
  const res = await authedRequest.get('/api/user');
  expect(res.status()).toBe(200);
});
```

## Test User Credentials

Defaults (override via env vars if needed):

| Env var             | Default                                     |
| ------------------- | ------------------------------------------- |
| `E2E_TEST_EMAIL`    | `e2e-playwright@local.test`                 |
| `E2E_TEST_PASSWORD` | _(long passphrase — see `global-setup.ts`)_ |
| `E2E_TEST_NAME`     | `Playwright E2E User`                       |

The passphrase is intentionally long — nobody has to type it manually.

## Browser Tests Setup

### WSL

Install Chromium system dependencies:

```bash
bunx playwright install --with-deps chromium
```

Then run:

```bash
bun e2e:browser
```

### Docker / CI

Use `bun run e2e:docker` — it spins up a fully isolated stack with Chromium pre-installed. No manual image setup needed. See [Docker / CI Mode](#docker--ci-mode) below.

## Docker / CI Mode

Run the full suite (API + browser) in a self-contained, isolated Docker stack:

```bash
bun run e2e:docker
```

**How it works:**

1. Tears down any leftover containers from a previous run
2. Builds images; spins up ephemeral Postgres (RAM-backed tmpfs) + app server + Playwright runner
3. Postgres runs `docker/e2e/init/` SQL scripts on first init — full schema + seeded test users, no runtime migrations needed
4. Playwright waits for the app healthcheck, then runs all tests
5. Always tears down — containers, volumes, orphans — regardless of outcome
6. Exits with Playwright's own exit code so cron / CI picks it up correctly

**Orchestration:**

| File                        | Role                                                                  |
| --------------------------- | --------------------------------------------------------------------- |
| `docker-compose.e2e.yml`    | Three-service stack: `db`, `app`, `e2e`                               |
| `docker/e2e/init/`          | SQL init scripts — schema + seed users; run by Postgres on first init |
| `docker/Dockerfile.app-e2e` | App image — full deps + build; `bun run start` only (no migrations)   |
| `docker/Dockerfile.e2e`     | Playwright/Chromium runner image (official Microsoft image, Node.js)  |
| `scripts/e2e-ci.sh`         | Wraps compose up/down, captures Playwright's exit code                |

**Env vars:** all have safe defaults — the stack works out of the box with no `.env` file. Override inline:

```bash
POSTGRES_PASSWORD=secret JWT_SECRET=s3cr3t bun run e2e:docker
```

**Cron** (daily at 02:00, logs appended to file):

```cron
0 2 * * * cd /path/to/bun-boiler && ./scripts/e2e-ci.sh >> /var/log/bun-boiler-e2e.log 2>&1
```

## Configuration

See `playwright.config.ts` at the project root.

- **Web server**: `bun run dev` — auto-started before tests, reused between runs (non-CI)
- **Base URL**: `http://localhost:3210` (override with `E2E_BASE_URL`)
- **Auth state**: `.auth/user.json` (git-ignored)

## Prerequisites

A running PostgreSQL database is required. Use the same env vars as the main app (`POSTGRES_*`, `JWT_SECRET`).
