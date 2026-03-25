# ✅ Validation Utils

Zod-based request body parsing and error mapping.

| File              | Export         | Description                                                         |
| ----------------- | -------------- | ------------------------------------------------------------------- |
| `mapZodErrors.ts` | `mapZodErrors` | Converts a `ZodError` into an array of `{ field, message }` objects |
| `parseBody.ts`    | `parseBody`    | Parses and validates a request body against a Zod schema            |

## Usage

```ts
import { parseBody } from '@backend/utils/validation/parseBody';
import { z } from 'zod';

const schema = z.object({ email: z.string().email(), name: z.string() });

const parsed = parseBody(schema, await req.json().catch(() => null));
if (!parsed.success) return parsed.response; // 400 Response
// parsed.data is fully typed here
```
