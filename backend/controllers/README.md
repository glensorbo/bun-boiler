# 🎮 Controllers

The controller layer is the HTTP boundary of the application. Controllers receive requests from `Bun.serve()` routes, validate input with Zod, delegate to services, and return `Response` objects.

## 📁 Structure

```
controllers/
├── userController.ts   # GET /api/user, GET /api/user/:id
├── authController.ts   # POST /api/auth/create-user, POST /api/auth/set-password
└── tests/
    ├── userController.test.ts
    └── authController.test.ts
```

## 📐 Responsibilities

- Parse path params, query strings, and request bodies
- Validate request bodies with Zod via `parseBody` — only failing fields appear in errors
- Call the appropriate service method
- Return a `Response` using helpers from `@backend/utils/response/`

Controllers contain **no business logic** and **no direct database access**.

## 🏭 Factory Pattern

Controllers are created via a factory function so the service dependency can be swapped in tests:

```ts
export const createUserController = (service: typeof UserServiceType) => ({
  async getUsers(): Promise<Response> {
    const users = await service.getAllUsers();
    return successResponse(users);
  },
});

// Default instance wired to the real service
export const userController = createUserController(userService);
```

## ✅ Validation with Zod

Use `parseBody` from `@backend/utils/validation/parseBody` with schemas from `@backend/schemas/`:

```ts
import { parseBody } from '@backend/utils/validation/parseBody';
import { createUserSchema } from '@backend/schemas/auth';

const parsed = parseBody(createUserSchema, await req.json().catch(() => null));
if (!parsed.success) return parsed.response; // 400 with only the failing fields

// parsed.data is fully typed here
const result = await service.createUser(parsed.data.email, parsed.data.name);
```

## 📤 Response Helpers

Always use the helpers from `@backend/utils/response/` — never construct `Response` objects manually:

| Helper                             | Status | Use when                |
| ---------------------------------- | ------ | ----------------------- |
| `successResponse(data, status?)`   | 200    | Request succeeded       |
| `notFoundError(msg, details?)`     | 404    | Resource not found      |
| `validationError(msg, errors[])`   | 400    | Input validation failed |
| `unauthorizedError(msg, details?)` | 401    | Auth check failed       |

## 🧪 Testing

Tests inject a mock service via the factory — no HTTP server or database required:

```ts
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';

const mockService = createUserService(mockUserRepository);
const controller = createUserController(mockService);

const response = await controller.getUsers();
expect(response.status).toBe(200);
```
