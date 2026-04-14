/**
 * Shared context passed through the middleware chain.
 * Middleware can attach typed data (e.g. ctx.user) for downstream handlers.
 */
export type Ctx = Record<string, unknown>;
