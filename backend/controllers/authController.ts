import { authService, UserAlreadyExistsError } from '../services/authService';
import { createUserSchema, setPasswordSchema } from '@backend/schemas/auth';
import { successResponse } from '@backend/utils/response/successResponse';
import { validationError } from '@backend/utils/response/validationError';
import { parseBody } from '@backend/utils/validation/parseBody';

import type { authService as AuthServiceType } from '../services/authService';
import type { BunRequest, Ctx } from '@backend/middleware';
import type { AppJwtPayload } from '@backend/types/auth';

/**
 * Auth Controller Factory
 * Accepts service as dependency for testability
 */
export const createAuthController = (service: typeof AuthServiceType) => ({
  /**
   * POST /api/auth/create-user
   * Authenticated users create a new user by email + name.
   * Returns a signup link containing a short-lived JWT for the new user.
   */
  async createUser(req: BunRequest): Promise<Response> {
    const parsed = parseBody(
      createUserSchema,
      await req.json().catch(() => null),
    );
    if (!parsed.success) return parsed.response;

    try {
      const result = await service.createUser(
        parsed.data.email,
        parsed.data.name,
      );
      return successResponse(result, 201);
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        return validationError('Email already in use', [
          { field: 'email', message: 'A user with this email already exists' },
        ]);
      }
      throw err;
    }
  },

  /**
   * POST /api/auth/set-password
   * New user sets their password using the signup JWT from their invite link.
   * Returns a regular auth JWT on success.
   */
  async setPassword(req: BunRequest, ctx: Ctx): Promise<Response> {
    const parsed = parseBody(
      setPasswordSchema,
      await req.json().catch(() => null),
    );
    if (!parsed.success) return parsed.response;

    const { sub } = ctx.user as AppJwtPayload;
    const result = await service.setPassword(sub, parsed.data.password);
    return successResponse(result);
  },
});

export const authController = createAuthController(authService);
