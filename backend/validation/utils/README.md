# ✅ Validation Utils

Zod-based request body validation and error mapping.

| File                 | Export            | Description                                                         |
| -------------------- | ----------------- | ------------------------------------------------------------------- |
| `mapZodErrors.ts`    | `mapZodErrors`    | Converts a `ZodError` into an array of `{ field, message }` objects |
| `validateRequest.ts` | `validateRequest` | Validates a request body against a Zod schema                       |

## Usage

```ts
import { validateRequest } from '@backend/validation/utils/validateRequest';
import { validationErrorResponse } from '@backend/utils/response/validationErrorResponse';
import { z } from 'zod';

const schema = z.object({ email: z.string().email(), name: z.string() });

const validation = validateRequest(schema, await req.json().catch(() => null));
if (validation.errors)
  return validationErrorResponse('Validation failed', validation.errors); // 400 Response
// validation.data is fully typed here
```
