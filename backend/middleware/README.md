# 🔗 Middleware

Composable middleware for `Bun.serve()` route handlers. Middleware runs before the route handler, can augment a shared `ctx` object, and can short-circuit the chain by returning a `Response`.

All handlers wrapped with `withMiddleware` automatically receive:

- **CORS headers** on every response (controlled by `CORS_ORIGIN` env var)
- **OPTIONS preflight** handling (204 with correct Access-Control headers)
- **Request/response logging** (`METHOD /path → STATUS (Xms)`)

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
  authRateLimit,
  authMiddleware,
  requireRole('admin'),
)((req, ctx) => {
  const { sub } = (ctx as AuthCtx).user;
  return controller.getProfile(sub);
});
```

Middleware runs left to right. The first one to return a `Response` short-circuits — the handler and remaining middleware are skipped.

## `authMiddleware`

Extracts and verifies a Bearer JWT from the `Authorization` header. **Rejects signup tokens** — those are only valid on `/api/auth/set-password`.

**On success:** attaches the decoded `AppJwtPayload` to `ctx.user` and returns `null` (chain continues).  
**On failure:** returns `401 Unauthorized` (chain stops).

**Requires:** `JWT_SECRET` environment variable.

## `signupTokenMiddleware`

Same structure as `authMiddleware` but **only accepts signup tokens** (`tokenType: 'signup'`). Used exclusively on the `/api/auth/set-password` route. Regular auth tokens are rejected.

## `requireRole(...roles)`

Factory that returns a middleware requiring `ctx.user.role` to match one of the given roles.  
**Must be used after `authMiddleware`** (relies on `ctx.user` being populated).

```ts
withMiddleware(
  authMiddleware,
  requireRole('admin'),
)((req, ctx) => {
  return controller.adminOnlyAction(req, ctx);
});
```

**On success:** returns `null` (chain continues).  
**On mismatch:** returns `403 Forbidden`.

## `authRateLimit` / `createRateLimitMiddleware`

In-memory rate limiter. `authRateLimit` allows 10 requests per minute per IP and is applied to the login and refresh endpoints.

```ts
// Custom rate limit
const myLimit = createRateLimitMiddleware({ max: 20, windowMs: 60_000 });

// Pre-configured for auth routes
withMiddleware(authRateLimit)((req) => controller.login(req));
```

> ⚠️ In-memory only — single instance. For multi-instance deployments, replace the store with Redis.

## Token Types

| Token type | Issued by         | Lifetime | Accepted by             |
| ---------- | ----------------- | -------- | ----------------------- |
| `auth`     | `signAuthToken`   | 15 min   | `authMiddleware`        |
| `signup`   | `signSignupToken` | 1 hour   | `signupTokenMiddleware` |

## Adding a New Middleware

Create a new file in `backend/middleware/` and export a `MiddlewareFn`:

```ts
// backend/middleware/myMiddleware.ts
import type { MiddlewareFn } from '.';

export const myMiddleware: MiddlewareFn = async (req, ctx) => {
  if (!someCondition) {
    return new Response('Rejected', { status: 400 });
  }
  ctx.myData = 'something';
  return null; // continue
};
```

Then compose it in your routes:

```ts
withMiddleware(authMiddleware, myMiddleware)((req, ctx) => { ... })
```

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
  const { sub } = (ctx as AuthCtx).user;
  return controller.getProfile(sub);
});
```

Middleware runs left to right. The first one to return a `Response` short-circuits — the handler and remaining middleware are skipped.

## `authMiddleware`

Extracts and verifies a Bearer JWT from the `Authorization` header. **Rejects signup tokens** — those are only valid on `/api/auth/set-password`.

**On success:** attaches the decoded `AppJwtPayload` to `ctx.user` and returns `null` (chain continues).  
**On failure:** returns `401 Unauthorized` (chain stops).

```ts
import { authMiddleware } from '@backend/middleware/authMiddleware';
import type { AuthCtx } from '@backend/middleware/authMiddleware';
import type { AppJwtPayload } from '@backend/types/auth';

withMiddleware(authMiddleware)((req, ctx) => {
  const { sub, email } = (ctx as AuthCtx).user;
  return controller.getProfile(sub);
});
```

**Requires:** `JWT_SECRET` environment variable.

## `signupTokenMiddleware`

Same structure as `authMiddleware` but **only accepts signup tokens** (`tokenType: 'signup'`). Used exclusively on the `/api/auth/set-password` route. Regular auth tokens are rejected.

```ts
import { signupTokenMiddleware } from '@backend/middleware/signupTokenMiddleware';
import type { SignupCtx } from '@backend/middleware/signupTokenMiddleware';

withMiddleware(signupTokenMiddleware)((req, ctx) => {
  const { sub } = (ctx as SignupCtx).user;
  return authController.setPassword(req, ctx);
});
```

## Token Types

| Token type | Issued by         | Lifetime | Accepted by             |
| ---------- | ----------------- | -------- | ----------------------- |
| `auth`     | `signAuthToken`   | 7 days   | `authMiddleware`        |
| `signup`   | `signSignupToken` | 1 hour   | `signupTokenMiddleware` |

See `@backend/types/auth` for `AppJwtPayload` and `TokenType`.

## `requireRole(…roles)`

Factory that returns a middleware requiring the authenticated user to have one of the given roles. Must be used after `authMiddleware`. Returns 403 Forbidden on role mismatch.

```ts
import { requireRole } from '@backend/middleware/requireRole';

withMiddleware(
  authMiddleware,
  requireRole('admin'),
)((req, ctx) => {
  return adminController.doAdminThing(req, ctx);
});
```

**Parameters:** one or more `UserRole` values (`'admin'` | `'user'`).  
**On success:** returns `null` (chain continues).  
**On failure (wrong role):** returns `403 Forbidden`.  
**On failure (not authenticated):** returns `401 Unauthorized`.

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
