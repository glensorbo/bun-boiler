import { verifyToken } from '@backend/utils/auth/verifyToken';
import { unauthorizedError } from '@backend/utils/response/unauthorizedError';

import type { Ctx, MiddlewareFn } from '.';
import type { AppJwtPayload } from '@backend/types/auth';

export type SignupCtx = Ctx & { user: AppJwtPayload };

/**
 * Signup Token Middleware
 *
 * Verifies that the Bearer JWT is a valid signup token (tokenType: 'signup').
 * Only valid for the set-password endpoint — regular auth tokens are rejected.
 *
 * On success, attaches the decoded payload to ctx.user.
 * On failure, returns 401 — short-circuiting the chain.
 *
 * @example
 * withMiddleware(signupTokenMiddleware)((req, ctx) => {
 *   const { sub } = (ctx as SignupCtx).user;
 *   return controller.setPassword(req, ctx);
 * })
 */
export const signupTokenMiddleware: MiddlewareFn = async (req, ctx) => {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorizedError('Missing or invalid Authorization header');
  }

  const payload = await verifyToken(authHeader.slice(7));

  if (!payload) {
    return unauthorizedError('Invalid or expired token');
  }

  if (payload.tokenType !== 'signup') {
    return unauthorizedError('A signup token is required for this endpoint');
  }

  ctx.user = payload;
  return null;
};
