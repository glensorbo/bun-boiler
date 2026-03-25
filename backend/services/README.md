# ⚙️ Services

The service layer contains all business logic. Services sit between controllers and repositories — they transform data, enforce rules, and ensure sensitive fields (like passwords) are never leaked to the HTTP layer.

## 📁 Structure

```
services/
├── userService.ts    # Business logic for user read operations
├── authService.ts    # User creation and password onboarding flow
└── tests/
    ├── userService.test.ts
    └── authService.test.ts
```

## 📐 Responsibilities

- Apply business rules and data transformations
- Omit sensitive fields before returning data (e.g., strip `password`)
- Orchestrate multiple repository calls when needed
- Throw typed error classes for known failure cases
- Return domain types — not raw DB types

Services contain **no HTTP logic** (no `Request`/`Response`) and **no direct database access**.

## 🏭 Factory Pattern

Services are created via a factory function so the repository dependency can be swapped in tests:

```ts
export const createUserService = (repo: typeof UserRepositoryType) => ({
  async getAllUsers(): Promise<User[]> {
    const users = await repo.getAll();
    return users.map(({ password: _password, ...safeUser }) => safeUser);
  },
});

// Default instance wired to the real repository
export const userService = createUserService(userRepository);
```

## 🔐 Sensitive Field Handling

The service layer is responsible for stripping fields that must not reach the client. Use destructuring with a discard variable:

```ts
const { password: _password, ...safeUser } = user;
return safeUser;
```

## 🚨 Typed Error Classes

Services throw typed error classes for known failure cases. Controllers catch these and return the appropriate HTTP response:

```ts
// In authService.ts
export class UserAlreadyExistsError extends Error { ... }
export class UserNotFoundError extends Error { ... }

// In authController.ts
try {
  return successResponse(await service.createUser(email, name), 201);
} catch (err) {
  if (err instanceof UserAlreadyExistsError) {
    return validationError('Email already in use', [{ field: 'email', message: '...' }]);
  }
  throw err;
}
```

## 🧪 Testing

Tests inject a mock repository — no database required:

```ts
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';

const service = createUserService(mockUserRepository);
const users = await service.getAllUsers();
expect(users[0]).not.toHaveProperty('password');
```
