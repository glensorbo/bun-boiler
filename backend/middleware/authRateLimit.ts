import { createRateLimitMiddleware } from './createRateLimitMiddleware';

/** 10 requests per minute — applied to public auth endpoints. */
export const authRateLimit = createRateLimitMiddleware({
  max: 10,
  windowMs: 60_000,
});
