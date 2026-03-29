# 🚀 bun-boiler

A full-stack boilerplate built on [Bun](https://bun.sh) with a React 19 frontend, layered backend architecture, PostgreSQL via Drizzle ORM, and JWT authentication. Everything — runtime, bundler, test runner, package manager — is Bun.

## ✨ Features

- ⚡ **Bun** as runtime, bundler, test runner, and package manager
- ⚛️ **React 19** with HMR in development and optimized production builds
- 🗄️ **Drizzle ORM** with PostgreSQL — migrations, typed schemas, string-mode timestamps
- 🏗️ **Layered backend** — Controller → Service → Repository with factory-based dependency injection
- 🔐 **JWT authentication** — login, invite-based user creation, password setup, and change-password flows
- 🛡️ **RBAC** — role-based access control with `requireRole` middleware (`admin` | `user`)
- 🚦 **Rate limiting** — in-memory per-IP limiter applied to auth endpoints
- 🌐 **CORS** — automatic CORS headers on every response via `withMiddleware`
- 🔴 **Redux Toolkit + RTK Query** — typed server state with `ApiErrorResponse`-typed errors
- 💀 **Skeleton loaders** — `TableSkeleton`, `ListSkeleton`, `CardSkeleton` shared components
- 🛡️ **Error boundary** — app-level React error boundary with reset support
- 🗄️ **DB resilience** — connection pool + startup ping with 5-attempt exponential backoff
- 🧪 **Unit tests** with dependency injection (no database required)
- 🔍 **oxlint + oxfmt** for linting and formatting
- ⚙️ **React Compiler** via ESLint plugin
- 🐶 **Husky** pre-push hook that runs all checks before pushing
- 🌐 **REST files** for testing every endpoint with [kulala.nvim](https://github.com/mistweaverco/kulala.nvim)
- 🔭 **OpenTelemetry** — optional tracing + logs via SigNoz (`docker-compose.signoz.yml`)
- 📊 **Rybbit Analytics** — optional privacy-first frontend analytics (`docker-compose.rybbit.yml`)

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.3+
- PostgreSQL database

## 🛠️ Setup

```bash
bun install
```

Copy the env example and fill in your values:

```bash
cp .env.example .env
```

```env
# PostgreSQL
POSTGRES_SERVER=localhost:5432
POSTGRES_DB=bun_boiler
POSTGRES_USER=bun_boiler_user
POSTGRES_PASSWORD=bun_boiler_pass

# Auth
JWT_SECRET=your-secret-key-here
APP_URL=http://localhost:3000

# CORS — * allows all origins; comma-separate for specific origins
CORS_ORIGIN=*

# Seed
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change-me-on-first-login
```

Run migrations and seed the initial admin user:

```bash
bun run db:migrate
bun run db:seed
```

## 🧑‍💻 Development

```bash
bun dev        # Start dev server with HMR at http://localhost:3000
```

## 📦 Production

```bash
bun run build  # Bundle frontend to dist/
bun start      # Start production server
```

## 🗄️ Database

```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Apply migrations to the database
bun run db:seed      # Seed the initial admin user (idempotent)
bun run db:push      # Push schema directly (dev only)
bun run db:studio    # Open Drizzle Studio
```

## 🧪 Testing

```bash
bun test               # Run all tests
bun test <path>        # Run a single test file
bun test --watch       # Watch mode
```

## 🔍 Linting & Formatting

```bash
bun run lint           # oxlint (type-aware)
bun run lint:compiler  # ESLint React Compiler check
bun run format         # Auto-format with oxfmt
bun run format:check   # Check formatting only
bun run cc             # Full check suite (test + lint + format)
```

## 🔐 API Endpoints

| Method | Path                        | Auth       | Role    | Description                            |
| ------ | --------------------------- | ---------- | ------- | -------------------------------------- |
| `POST` | `/api/auth/login`           | —          | —       | Login, returns auth JWT                |
| `POST` | `/api/auth/create-user`     | Auth JWT   | `admin` | Invite a new user, returns signup link |
| `POST` | `/api/auth/set-password`    | Signup JWT | —       | Set password, returns auth JWT         |
| `POST` | `/api/auth/change-password` | Auth JWT   | —       | Change own password                    |
| `POST` | `/api/auth/refresh`         | —          | —       | Refresh auth token via cookie          |
| `POST` | `/api/auth/logout`          | —          | —       | Clears refresh token cookie            |
| `GET`  | `/api/user`                 | Auth JWT   | —       | List all users                         |
| `GET`  | `/api/user/:id`             | Auth JWT   | —       | Get user by ID                         |

**Token types:** `auth` (15 min, for regular requests) and `signup` (1 hour, for the set-password flow). Each middleware validates the correct token type and rejects the other.

## ⚙️ Optional Integrations

Both integrations follow the same opt-in pattern: fully inactive (zero overhead) when the relevant env vars are not set.

### 🔭 OpenTelemetry — Distributed Tracing & Logs

Uses [SigNoz](https://signoz.io) as a local observability backend.

```bash
docker compose -f docker-compose.signoz.yml up -d
```

Then enable in `.env`:

```env
OTEL_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=bun-boiler
```

Open SigNoz at **http://localhost:8080**.

### 📊 Rybbit Analytics — Privacy-First Frontend Analytics

Uses [Rybbit](https://rybbit.io) for cookie-free, privacy-respecting page view and event tracking.

```bash
# Requires GHCR authentication: gh auth token | docker login ghcr.io -u <your-gh-username> --password-stdin
docker compose -f docker-compose.rybbit.yml up -d
```

Open **http://localhost:8090**, create an account, add a site, and copy the Site ID. Then enable in `.env`:

```env
BUN_PUBLIC_RYBBIT_HOST=http://localhost:8090
BUN_PUBLIC_RYBBIT_SITE_ID=<your-site-id>
```

Restart `bun dev`. Pageviews are tracked automatically on every route change. Track custom events in components via the `useAnalytics` hook:

```tsx
import { useAnalytics } from '@frontend/features/analytics/useAnalytics';

const { trackEvent } = useAnalytics();
trackEvent('button_clicked', { label: 'Save' });
```

See `frontend/features/analytics/README.md` for full usage details.

## 🌐 REST Testing

Every endpoint has a request in `rest/`. Copy the env example to get started:

```bash
cp rest/http-client.env.json.example rest/http-client.env.json
```

Open any `.http` file in Neovim with kulala and send requests with your kulala keybind. See `rest/README.md` for details.

## 🏗️ Architecture

```
bun-boiler/
├── backend/
│   ├── server.ts            # Bun.serve() entry point
│   ├── routes/              # Route definitions — spread into Bun.serve()
│   ├── controllers/         # HTTP layer — validate request, call service, return Response
│   ├── services/            # Business logic — returns ErrorOr<T>
│   ├── repositories/        # Data access — Drizzle queries only
│   ├── middleware/          # Composable middleware (auth, signup token)
│   ├── db/
│   │   ├── client.ts        # Singleton Drizzle client
│   │   ├── seed.ts          # Admin user seed script
│   │   ├── schemas/         # Table definitions (source of truth for types)
│   │   └── migrations/      # Auto-generated SQL migration files
│   ├── types/               # Types derived from Drizzle schemas
│   ├── utils/               # Response helpers, auth utilities
│   └── validation/          # Zod schemas + validateRequest / validateParam
├── frontend/
│   ├── main.tsx             # Entry point, HMR setup, Redux Provider
│   ├── App.tsx              # Root component
│   └── redux/
│       ├── store.ts         # Redux store
│       └── api/             # RTK Query — one file per backend controller
├── rest/                    # HTTP request files for API testing
├── public/                  # Static assets and HTML entrypoint (dev)
├── build.ts                 # Production build script
└── drizzle.config.ts        # Drizzle Kit config
```

### Request flow

```
Bun.serve() → withMiddleware(...) → Controller → Service → Repository → Drizzle → PostgreSQL
```

### Key patterns

- **`ErrorOr<T>`** — services never throw; return `{ data: T, error: null }` or `{ data: null, error: AppError[] }`
- **Factory functions** — controllers and services accept dependencies as arguments for testability
- **Types from schema** — all types derived via `$inferSelect` / `$inferInsert`, never manually defined
- **Typed API errors** — RTK Query `baseQuery` narrows errors to `ApiErrorResponse` across all hooks
- **RBAC** — `requireRole('admin')` middleware guards admin-only routes; role is embedded in the JWT
- **Startup validation** — `validateEnv()` + `pingDb()` run before `Bun.serve()` so the server never starts with bad config

See the READMEs in each subdirectory for layer-specific conventions.
