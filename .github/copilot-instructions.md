# Copilot Instructions

## Runtime & Tooling

- Use `bun` everywhere — not `node`, `npm`, `npx`, `ts-node`, or `yarn`
- Bun automatically loads `.env`; never use `dotenv`
- Use `Bun.file` instead of `fs.readFile`/`fs.writeFile`
- Use `Bun.$\`cmd\``instead of`execa`

## After Making Changes

After adding or altering code, always run `bun cc` as the final step to verify everything is ok:

```sh
bun run cc
```

If formatting fails, fix it by running `bun run format`. All other errors should be understood and corrected at the source.

## Commands

```sh
bun dev                  # Start dev server with HMR (bun --hot backend/server.ts)
bun start                # Production server (NODE_ENV=production)
bun run build            # Build frontend to dist/ (processes frontend/**/*.html)
bun test                 # Run all tests
bun test <path>          # Run a single test file
bun test --watch         # Watch mode
bun run lint             # oxlint (type-aware)
bun run lint:fix         # Auto-fix lint issues
bun run format           # oxfmt formatter
bun run format:check     # Check formatting
bun run cc               # Full check: test + lint + compiler + format check
bun run db:generate      # Generate Drizzle migrations
bun run db:push          # Push schema changes to DB
bun run db:studio        # Open Drizzle Studio
```

## Architecture

This is a full-stack Bun app with a React frontend and a layered backend.

**Request flow:** `Bun.serve()` routes → Controller → Service → Repository → Drizzle ORM → PostgreSQL

**Backend layers** (`backend/`):

- `server.ts` — `Bun.serve()` entry point; routes map directly to controller methods
- `controllers/` — HTTP boundary; parse request, call service, return `Response`
- `services/` — business logic; data transformation (e.g., stripping password fields)
- `repositories/` — data access only; raw Drizzle queries, no business logic
- `db/schemas/` — Drizzle table definitions (source of truth for types)
- `db/client.ts` — singleton `getDb()` using cached postgres connection
- `utils/errorHelpers.ts` — shared `successResponse`, `notFoundError`, `validationError` helpers
- `types/` — types derived from Drizzle schemas via `$inferSelect` / `$inferInsert`
- `test-helpers/mockData.ts` — mock repository and mock data for unit tests (no DB required)

**Frontend** (`frontend/`):

- `main.tsx` → `App.tsx` — React 19 with StrictMode and HMR support
- HTML files in `frontend/` are the build entrypoints; `bun run build` scans them automatically
- In dev, `public/index.html` is served directly by `Bun.serve()` with HMR
- In production, `serveProdBuild.ts` serves from `dist/` with SPA fallback to `index.html`

**Env var required:** `DATABASE_URL` (PostgreSQL connection string)

## Key Conventions

### Factory Functions for Dependency Injection

Controllers and services are created via factory functions to enable testability without mocking modules:

```ts
// Define
export const createUserService = (repo: typeof UserRepositoryType) => ({ ... });
export const userService = createUserService(userRepository); // default export

// In tests — inject mock repo
const mockService = createUserService(mockUserRepository);
const controller = createUserController(mockService);
```

### Types Derived from Schema

Types are derived from Drizzle schema definitions — never defined manually:

```ts
// backend/db/schemas/users.ts
export const users = pgTable('users', { ... });

// backend/types/users.ts
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Path Aliases

Use these instead of relative imports when crossing layer boundaries:

- `@backend/*` → `./backend/*`
- `@frontend/*` → `./frontend/*`
- `@type/*` → `./types/*`

### Error Responses

All API errors use the helpers in `backend/utils/errorHelpers.ts`. The `ApiErrorResponse` shape is:

```ts
{ message: string; status: number; error: { type: 'validation' | 'notFound'; errors: FieldError[]; details?: string } }
```

### Testing

- Tests use `bun:test` (`describe`, `test`, `expect`) — no jest/vitest
- `bunfig.toml` preloads `frontend/test-setup.ts` which registers `happy-dom` globally for DOM tests
- Unit tests inject mock dependencies via factory functions; no DB required
- `backend/test-helpers/mockData.ts` contains shared mock data and a `mockUserRepository`

### Adding New Routes

1. Add schema to `backend/db/schemas/`
2. Add type to `backend/types/`
3. Add repository in `backend/repositories/`
4. Add service in `backend/services/` (use factory pattern)
5. Add controller in `backend/controllers/` (use factory pattern)
6. Register route in `backend/server.ts`
