# 🔗 Middleware

Composable middleware for `Bun.serve()` route handlers. Middleware runs before the route handler, can augment a shared `ctx` object, and can short-circuit the chain by returning a `Response`.

## Core Types (`index.ts`)

```ts
// A request augmented with Bun's route params
type BunRequest = Request & { params: Record<string, string> };

// Shared context passed through the chain — middleware attaches data here
type Ctx = Record<string, unknown>;

// Returns null to continue, or a Response to short-circuit
type MiddlewareFn = (
  req: BunRequest,
  ctx: Ctx,
) => Response | null | Promise<Response | null>;

// Handler that receives the fully populated ctx
type HandlerFn = (req: BunRequest, ctx: Ctx) => Response | Promise<Response>;
```

## `withMiddleware`

Composes middleware before a handler, returning a standard `BunHandler` compatible with `Bun.serve()` routes.

```ts
withMiddleware(...middlewares: MiddlewareFn[]) => (handler: HandlerFn) => BunHandler
```

**Example — single middleware:**

```ts
withMiddleware(authMiddleware)((req, ctx) => {
  return controller.getAll();
});
```

**Example — chained middleware:**

```ts
withMiddleware(
  authMiddleware,
  rateLimitMiddleware,
  loggingMiddleware,
)((req, ctx) => {
  const user = ctx.user as JWTPayload;
  return controller.getProfile(user.sub);
});
```

Middleware runs left to right. The first one to return a `Response` short-circuits — the handler and remaining middleware are skipped.

## `authMiddleware`

Extracts and verifies a Bearer JWT from the `Authorization` header.

**On success:** attaches the decoded `JWTPayload` to `ctx.user` and returns `null` (chain continues).  
**On failure:** returns a `401 Unauthorized` response (chain stops).

```ts
import { authMiddleware } from '@backend/middleware/authMiddleware';
import type { AuthCtx } from '@backend/middleware/authMiddleware';
import type { JWTPayload } from 'jose';

withMiddleware(authMiddleware)((req, ctx) => {
  const { sub, email } = ctx.user as JWTPayload;
  return controller.getProfile(sub);
});
```

**Requires:** `JWT_SECRET` environment variable.

## Adding a New Middleware

Create a new file in `backend/middleware/` and export a `MiddlewareFn`:

```ts
// backend/middleware/rateLimitMiddleware.ts
import type { MiddlewareFn } from '.';

export const rateLimitMiddleware: MiddlewareFn = async (req, ctx) => {
  const allowed = await checkRateLimit(req);
  if (!allowed) {
    return new Response('Too Many Requests', { status: 429 });
  }
  return null; // continue
};
```

Then compose it in your routes:

```ts
withMiddleware(authMiddleware, rateLimitMiddleware)((req, ctx) => { ... })
```
