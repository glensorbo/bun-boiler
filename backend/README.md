# 🏗️ Backend

The backend is a `Bun.serve()` HTTP server with a three-layer architecture: **Controller → Service → Repository**.

## 📁 Structure

```
backend/
├── server.ts           # Entry point — Bun.serve() with all routes defined
├── serveProdBuild.ts   # Serves the production frontend build from dist/
├── controllers/        # HTTP boundary — parse requests, return Responses
├── services/           # Business logic — data transformation, rules
├── repositories/       # Data access — Drizzle queries, no business logic
├── db/                 # Database client and schema definitions
├── types/              # TypeScript types derived from Drizzle schemas
├── utils/              # Shared utilities (error/success response helpers)
└── test-helpers/       # Mock data and repositories for unit tests
```

## 🔄 Request Flow

```
Bun.serve() route
  → Controller   (HTTP parsing, calls service, returns Response)
  → Service      (business logic, strips sensitive fields, transforms data)
  → Repository   (Drizzle ORM query, returns raw DB types)
  → PostgreSQL
```

## 🔌 Server (`server.ts`)

Routes are defined directly on `Bun.serve()`. Each route maps to a controller method:

```ts
Bun.serve({
  routes: {
    '/api/user': { GET: () => userController.getUsers() },
    '/api/user/:id': {
      GET: (req) => userController.getUserById(req.params.id),
    },
    '/*': isProduction ? (req) => serveProdBuild(pathname) : index,
  },
  development: !isProduction && { hmr: true, console: true },
});
```

In **development**, the frontend HTML is served directly with HMR. In **production**, static files are served from `dist/` with SPA fallback to `index.html`.

## 🏭 Factory Pattern (Dependency Injection)

All controllers and services are created via factory functions so dependencies can be swapped in tests without module mocking:

```ts
// Factory
export const createUserService = (repo: typeof UserRepositoryType) => ({ ... });

// Default export (used in production)
export const userService = createUserService(userRepository);

// In tests — inject mock
const testService = createUserService(mockUserRepository);
```

## 📐 Layer Responsibilities

| Layer      | Does                                                  | Does NOT                  |
| ---------- | ----------------------------------------------------- | ------------------------- |
| Controller | Parse request params, call service, return `Response` | Business logic, DB access |
| Service    | Transform data, apply rules, omit sensitive fields    | DB queries, HTTP concerns |
| Repository | Run Drizzle queries, return raw DB types              | Any business logic        |

## 🧪 Testing Without a Database

Unit tests use `backend/test-helpers/mockData.ts` which provides a `mockUserRepository` and `mockUsers`. Injecting the mock via the factory means no database connection is needed:

```ts
const service = createUserService(mockUserRepository);
const controller = createUserController(service);
```

## ➕ Adding a New Resource

1. Add schema → `backend/db/schemas/myResource.ts`
2. Add types → `backend/types/myResource.ts` (use `$inferSelect` / `$inferInsert`)
3. Add repository → `backend/repositories/myResourceRepository.ts`
4. Add service → `backend/services/myResourceService.ts` (factory pattern)
5. Add controller → `backend/controllers/myResourceController.ts` (factory pattern)
6. Register route → `backend/server.ts`
7. Add mock data → `backend/test-helpers/mockData.ts`
8. Add tests → `backend/controllers/tests/` and `backend/services/tests/`
