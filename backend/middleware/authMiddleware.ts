import { jwtVerify } from 'jose';

import { unauthorizedError } from '@backend/utils/errorHelpers';

import type { Ctx, MiddlewareFn } from '.';
import type { JWTPayload } from 'jose';

export type AuthCtx = Ctx & { user: JWTPayload };

/**
 * Auth Middleware
 *
 * Extracts and verifies a Bearer JWT from the Authorization header.
 * On success, attaches the decoded payload to ctx.user for downstream use.
 * On failure, returns a 401 Unauthorized response — short-circuiting the chain.
 *
 * Requires JWT_SECRET env var to be set.
 *
 * @example
 * withMiddleware(authMiddleware)((req, ctx) => {
 *   const { sub } = ctx.user as JWTPayload;
 *   return controller.getProfile(sub);
 * })
 */
export const authMiddleware: MiddlewareFn = async (req, ctx) => {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

  const [payload, err] = await jwtVerify(token, secret)
    .then((result) => [result.payload, null] as const)
    .catch((error: unknown) => [null, error] as const);

  if (err !== null || payload === null) {
    return unauthorizedError('Invalid or expired token');
  }

  ctx.user = payload;
  return null;
};
