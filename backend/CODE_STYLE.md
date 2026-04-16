# ⚙️ Backend Code Style

## 📁 Folder structure

```
backend/
├── controllers/                     (HTTP boundary — parse, validate, respond)
│   └── tests/
├── services/                        (business logic, data transformation)
│   └── tests/
├── repositories/                    (Drizzle queries only, no business logic)
├── routes/                          (route definitions, spread into server.ts)
├── middleware/                      (auth, rate limiting, logging)
│   ├── tests/
│   └── types/
├── db/
│   ├── getDb.ts                     (singleton DB client)
│   ├── pingDb.ts
│   ├── seed.ts
│   ├── migrations/
│   └── schemas/                     (Drizzle table definitions)
│       └── tests/
├── features/                        (opt-in feature modules)
│   ├── mail/                        (optional SMTP — initMailClient, sendMail)
│   │   ├── mailTemplates/
│   │   ├── tests/
│   │   └── types/
│   ├── telemetry/                   (optional OTel tracing + structured logger)
│   │   ├── tests/
│   │   └── types/
│   └── validation/                  (Zod schemas + parsing utilities)
│       ├── schemas/
│       │   └── tests/
│       └── utils/
│           └── tests/
├── types/                           (shared TypeScript types, derived from schemas)
├── utils/
│   ├── auth/                        (JWT, hashing, token helpers)
│   │   └── tests/
│   ├── cors/
│   │   └── tests/
│   ├── response/                    (response helper functions)
│   │   └── tests/
│   └── test/                        (mock repositories and mock data for tests)
├── ws/                              (WebSocket upgrade, broadcast, handlers)
│   └── types/
└── server.ts                        (entry point — Bun.serve() startup)
```

## 🔄 Request flow

```
Bun.serve() → Middleware → Controller → Service → Repository → Drizzle ORM → PostgreSQL
```

| Layer      | Does                                             | Does NOT                    |
| ---------- | ------------------------------------------------ | --------------------------- |
| Middleware | Auth / rate-limit before the controller          | Return data                 |
| Controller | Parse request, validate input, call service      | Business logic, DB queries  |
| Service    | Business logic, transform data, strip PII fields | HTTP concerns, raw DB calls |
| Repository | Drizzle queries, return raw DB types             | Any business logic          |

## 📦 Files & exports

- One file exports exactly **one** thing — a function, object, or type
- Filenames are `camelCase` — e.g. `userService.ts`, `authMiddleware.ts`

## ✍️ Functions & arrow functions

Use plain **functions and objects** — not classes. Arrow functions for standalone utilities, method shorthand for object literals:

```ts
// ✅ Repository — plain object with method shorthand
export const userRepository = {
  async getAll() { ... },
  async getById(id: string) { ... },
};

// ✅ Utility function — arrow function
export const hashPassword = async (plain: string) =>
  Bun.password.hash(plain);
```

## 🏭 Factory pattern (dependency injection)

All controllers and services use factory functions so dependencies can be swapped in tests without module mocking:

```ts
// ✅ Service factory
export const createUserService = (repo: typeof UserRepositoryType) => ({
  async getAllUsers(): Promise<User[]> {
    const users = await repo.getAll();
    return users.map(({ password: _p, ...safe }) => safe);
  },
});

// Wired-up singleton for production
export const userService = createUserService(userRepository);
```

```ts
// ✅ In tests — inject mock instead
const service = createUserService(mockUserRepository);
const ctrl = createUserController(service);
```

## 🗂️ Imports

- Use **path aliases** when crossing layer boundaries — never `../../` relative imports:
  - `@backend/*` — anything inside `backend/`
- Relative imports are fine within the same directory
- Group imports: external packages first, then path aliases, then relative
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled)

```ts
// ✅
import { eq } from 'drizzle-orm';
import { getDb } from '@backend/db/getDb';
import type { User } from '@backend/types/user';

// ❌
import { getDb } from '../../db/getDb';
```

## 🛑 ErrorOr\<T\>

Services return `ErrorOr<T>` for expected failures instead of throwing. Controllers unwrap and map to the correct HTTP response:

```ts
// ✅ Service — signal failure with errorOr
import { errorOr } from '@backend/types/errorOr';

if (!user)
  return errorOr<User>(null, [
    { type: 'not_found', message: 'User not found' },
  ]);
return errorOr(user);

// ✅ Controller — check and map
const result = await service.getUser(id);
if (result.error) return serviceErrorResponse(result.error);
return successResponse(result.data);
```

Only throw for truly unexpected errors (programmer mistakes, invariant violations). Never swallow errors silently.

## 📬 Response helpers

Never construct `Response` objects manually — always use the helpers from `@backend/utils/response`:

```ts
import {
  successResponse, // 200 { data }
  notFoundError, // 404
  validationErrorResponse, // 422
  serviceErrorResponse, // maps ErrorOr errors to 403/404/500
  unauthorizedError, // 401
  tooManyRequestsError, // 429
} from '@backend/utils/response';
```

## ✅ Validation

- Zod schemas live in `backend/features/validation/schemas/` — one schema per file
- Use `validateRequest(schema, body)` for request bodies
- Use `validateParam(schema, value)` for path parameters
- Validation always happens in the **controller**, never in the service

```ts
const validation = validateParam(uuidSchema, id);
if (validation.errors)
  return validationErrorResponse('Validation failed', validation.errors);
```

## 🪵 Logging

Use `logger` from `@backend/features/telemetry/logger` everywhere. Never use `console.*` in backend code:

```ts
import { logger } from '@backend/features/telemetry/logger';

logger.info('User created', { userId, email });
logger.warn('Rate limit hit', { ip });
logger.error('DB query failed', { error: err.message });
```

## 🗄️ Database

- Always use the singleton: `getDb()` from `@backend/db/getDb` — never create a new client
- Table names: `snake_case` plural — `refresh_tokens`, `users`
- Column names in DB: `snake_case`; in TS: `camelCase`
- All tables have `created_at` / `updated_at` timestamps
- Use `dayjs().toISOString()` when setting `updatedAt` manually in updates
- **Never define types manually** — always derive from schema:

```ts
import { users } from '@backend/db/schemas/users';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## 🧪 Testing

- Use `bun:test` — never jest or vitest
- Inject mocks via the factory pattern — tests never touch a real database
- Mock repositories and data live in `@backend/utils/test`

```ts
import { describe, test, expect } from 'bun:test';
import { createUserService } from '../userService';
import { mockUserRepository } from '@backend/utils/test';

const service = createUserService(mockUserRepository);

describe('UserService', () => {
  test('strips password from returned users', async () => {
    const users = await service.getAllUsers();
    expect(users[0]).not.toHaveProperty('password');
  });
});
```

Test behaviour, not implementation — never assert that a specific internal method was called.

## ➕ Adding a new resource

Follow these steps **in order**:

1. 🗄️ Schema → `backend/db/schemas/<resource>.ts`
2. 📦 Types → `backend/types/<resource>.ts` (via `$inferSelect` / `$inferInsert`)
3. 🔌 Migration → `bun run db:generate`, review SQL, `bun run db:migrate`
4. 🗃️ Repository → `backend/repositories/<resource>Repository.ts`
5. ⚙️ Service → `backend/services/<resource>Service.ts` (factory pattern)
6. 🎮 Controller → `backend/controllers/<resource>Controller.ts` (factory pattern)
7. 🌐 Routes → `backend/routes/<resource>Routes.ts`, spread into `server.ts`
8. 📝 REST file → `rest/<resource>.http`, update `rest/README.md`
9. 🧪 Tests → `backend/services/tests/` and `backend/controllers/tests/`
10. ✅ Run `bun run cc`
