# 🔍 Validation

Centralised validation logic for the backend. All request validation, schemas, and Zod utilities live here.

## 📁 Structure

| Path       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `schemas/` | Zod schemas for each request body (grouped by domain) |
| `utils/`   | Zod helper utilities (`parseBody`, `mapZodErrors`)    |

## Usage

```ts
import { createUserSchema } from '@backend/validation/schemas/auth';
import { parseBody } from '@backend/validation/utils/parseBody';

const parsed = parseBody(createUserSchema, await req.json().catch(() => null));
if (!parsed.success) return parsed.response;
```
