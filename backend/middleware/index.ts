import { getRouteTemplate } from './getRouteTemplate';
import { logRequest } from './logRequest';
import { startHttpSpan } from '@backend/features/telemetry/startHttpSpan';
import { applyCorsHeaders } from '@backend/utils/cors/applyCorsHeaders';
import { corsPreflightResponse } from '@backend/utils/cors/corsPreflightResponse';
import type { BunRequest } from './types/BunRequest';
import type { Ctx } from './types/Ctx';
import type { MiddlewareFn } from './types/MiddlewareFn';

export type { BunRequest } from './types/BunRequest';
export type { Ctx } from './types/Ctx';
export type { MiddlewareFn } from './types/MiddlewareFn';

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

type HandlerFn = (req: BunRequest, ctx: Ctx) => Response | Promise<Response>;

type BunHandler = (req: BunRequest) => Response | Promise<Response>;

/**
 * Compose middleware functions before a route handler.
 * Each middleware runs in order; the first to return a Response short-circuits the chain.
 * CORS headers, request logging, HTTP traces, and HTTP metrics are applied to
 * every response automatically (traces/metrics are no-ops when OTEL_ENDPOINT is unset).
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
    const path = new URL(req.url).pathname;
    const route = getRouteTemplate(req);

    const span = startHttpSpan(req.method, route, path, (name) =>
      req.headers.get(name),
    );

    const finalize = (res: Response): Response => {
      const corsRes = applyCorsHeaders(req, res);
      logRequest(req, corsRes, performance.now() - start);
      span?.finish(corsRes.status);
      return corsRes;
    };

    if (req.method === 'OPTIONS') {
      return finalize(corsPreflightResponse(req));
    }

    const ctx: Ctx = {};

    for (const middleware of middlewares) {
      const result = await middleware(req, ctx);
      if (result !== null) {
        return finalize(result);
      }
    }

    const response = await handler(req, ctx);
    return finalize(response);
  };
