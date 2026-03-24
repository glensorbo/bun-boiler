# 🎮 Controllers

The controller layer is the HTTP boundary of the application. Controllers receive requests from `Bun.serve()` routes, delegate to services, and return `Response` objects.

## 📁 Structure

```
controllers/
├── userController.ts   # User route handlers
└── tests/
    └── userController.test.ts
```

## 📐 Responsibilities

- Extract parameters from request (path params, query, body)
- Call the appropriate service method
- Return a `Response` using the helpers from `utils/errorHelpers.ts`

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

## 📤 Response Helpers

Always use the helpers from `@backend/utils/errorHelpers.ts` — never construct `Response` objects manually:

| Helper                           | Status | Use when                |
| -------------------------------- | ------ | ----------------------- |
| `successResponse(data)`          | 200    | Request succeeded       |
| `notFoundError(msg, details?)`   | 404    | Resource not found      |
| `validationError(msg, errors[])` | 400    | Input validation failed |

## 🧪 Testing

Tests inject a mock service via the factory — no HTTP server or database required:

```ts
const mockService = createUserService(mockUserRepository);
const controller = createUserController(mockService);

const response = await controller.getUsers();
expect(response.status).toBe(200);
```
