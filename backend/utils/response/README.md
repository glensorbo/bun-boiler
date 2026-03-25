# 📨 Response Utils

HTTP response builder helpers for consistent API responses.

| File                   | Export              | Status          | Error Type     |
| ---------------------- | ------------------- | --------------- | -------------- |
| `successResponse.ts`   | `successResponse`   | 200 (or custom) | —              |
| `validationError.ts`   | `validationError`   | 400             | `validation`   |
| `notFoundError.ts`     | `notFoundError`     | 404             | `notFound`     |
| `unauthorizedError.ts` | `unauthorizedError` | 401             | `unauthorized` |

All error responses follow the `ApiErrorResponse` shape from `@backend/types/errors`.
