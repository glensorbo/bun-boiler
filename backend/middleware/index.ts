import { logger } from '@backend/telemetry';
import { applyCorsHeaders, corsPreflightResponse } from '@backend/utils/cors';

/**
 * Middleware System
 *
 * Composable middleware for Bun.serve() route handlers.
 * Middleware runs in order and can short-circuit by returning a Response,
 * or pass through by returning null — augmenting the shared ctx along the way.
 *
 * All handlers wrapped with withMiddleware automatically get:
 * - CORS headers on every response (controlled by CORS_ORIGIN env var)
 * - OPTIONS preflight handling
 * - Request/response logging
 *
 * Usage:
 *   withMiddleware(auth, rateLimit)((req, ctx) => controller.doSomething(req, ctx))
 */

export type BunRequest = Request & { params: Record<string, string> };

/**
 * Shared context passed through the middleware chain.
 * Middleware can attach typed data (e.g. ctx.user) for downstream handlers.
 */
export type Ctx = Record<string, unknown>;

/**
 * A middleware function.
 * Return null to continue the chain, or a Response to short-circuit.
 */
export type MiddlewareFn = (
  req: BunRequest,
  ctx: Ctx,
) => Response | null | Promise<Response | null>;

/**
 * A route handler that receives the request and populated context.
 */
type HandlerFn = (req: BunRequest, ctx: Ctx) => Response | Promise<Response>;

/**
 * A standard Bun.serve() route handler (no ctx — compatible with routes object).
 */
type BunHandler = (req: BunRequest) => Response | Promise<Response>;

const logRequest = (req: Request, res: Response, durationMs: number): void => {
  const ts = new Date().toISOString();
  const path = new URL(req.url).pathname;
  logger.info(
    `[${ts}] ${req.method} ${path} → ${res.status} (${Math.round(durationMs)}ms)`,
  );
};

/**
 * Compose middleware functions before a route handler.
 * Each middleware runs in order; the first to return a Response short-circuits the chain.
 * CORS headers and request logging are applied to every response automatically.
 *
 * @example
 * withMiddleware(authMiddleware, rateLimitMiddleware)((req, ctx) => {
 *   const user = ctx.user as JWTPayload;
 *   return controller.getProfile(user.sub);
 * })
 */
export const withMiddleware =
  (...middlewares: MiddlewareFn[]) =>
  (handler: HandlerFn): BunHandler =>
  async (req: BunRequest): Promise<Response> => {
    const start = performance.now();

    if (req.method === 'OPTIONS') {
      const res = corsPreflightResponse(req);
      logRequest(req, res, performance.now() - start);
      return res;
    }

    const ctx: Ctx = {};

    for (const middleware of middlewares) {
      const result = await middleware(req, ctx);
      if (result !== null) {
        const res = applyCorsHeaders(req, result);
        logRequest(req, res, performance.now() - start);
        return res;
      }
    }

    const response = await handler(req, ctx);
    const res = applyCorsHeaders(req, response);
    logRequest(req, res, performance.now() - start);
    return res;
  };
