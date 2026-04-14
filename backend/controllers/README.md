# 🎮 Controllers

The controller layer is the HTTP boundary of the application. Controllers receive requests from `Bun.serve()` routes, validate input with Zod, delegate to services, and return `Response` objects.

## 📁 Structure

```
controllers/
├── userController.ts          # GET /api/user, GET /api/user/:id, DELETE /api/user/:id (admin), PATCH /api/user/:id/role (admin), POST /api/user/:id/reset-password (admin)
├── authController.ts          # POST /api/auth/signup, /login, /create-user, /set-password, /refresh, /logout
├── integrationsController.ts  # GET /api/integrations, POST /api/integrations/mail/test
├── versionController.ts       # GET /api/version
└── tests/
    ├── userController.test.ts
    └── authController.test.ts
```

## 📐 Responsibilities

- Parse path params, query strings, and request bodies
- Validate request bodies with Zod via `validateRequest` — only failing fields appear in errors
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

Use `validateRequest` from `@backend/validation/utils/validateRequest` with schemas from `@backend/validation/schemas/`:

```ts
import { validateRequest } from '@backend/validation/utils/validateRequest';
import { validationErrorResponse } from '@backend/utils/response/validationErrorResponse';
import { createUserSchema } from '@backend/validation/schemas/auth';

const validation = validateRequest(
  createUserSchema,
  await req.json().catch(() => null),
);
if (validation.errors)
  return validationErrorResponse('Validation failed', validation.errors); // 400 with only the failing fields

// validation.data is fully typed here
const result = await service.createUser(
  validation.data.email,
  validation.data.name,
);
```

## 📤 Response Helpers

Always use the helpers from `@backend/utils/response/` — never construct `Response` objects manually:

| Helper                                   | Status | Use when                                |
| ---------------------------------------- | ------ | --------------------------------------- |
| `successResponse(data, status?)`         | 200    | Request succeeded                       |
| `notFoundError(msg, details?)`           | 404    | Resource not found                      |
| `validationErrorResponse(msg, errors[])` | 400    | Input validation failed                 |
| `serviceErrorResponse(errors[])`         | varies | Maps service-layer `AppError[]` to HTTP |
| `unauthorizedError(msg, details?)`       | 401    | Auth check failed                       |

## Integrations Controller

`getStatus()` is **async** and runs live health checks on every call — results are not cached. Each probe applies a **3 s timeout** and resolves to one of three statuses.

```ts
type IntegrationStatus = 'disabled' | 'healthy' | 'degraded';

type Integration = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus; // not `enabled: boolean`
  config: Record<string, string> | null;
};
```

| Integration | `'disabled'` when                        | `'degraded'` when         |
| ----------- | ---------------------------------------- | ------------------------- |
| `smtp`      | `SMTP_HOST` not set                      | `checkMailHealth()` fails |
| `otel`      | `OTEL_ENDPOINT` not set                  | endpoint unreachable      |
| `openpanel` | `BUN_PUBLIC_OPENPANEL_CLIENT_ID` not set | API unreachable           |
| `websocket` | never                                    | never                     |

The `websocket` integration is always `'healthy'`; its `config.connectedClients` reflects the live count via `getConnectedClientCount()`.

## 🧪 Testing

Tests inject a mock service via the factory — no HTTP server or database required:

```ts
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';

const mockService = createUserService(mockUserRepository);
const controller = createUserController(mockService);

const response = await controller.getUsers();
expect(response.status).toBe(200);
```
