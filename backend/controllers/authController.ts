import { authService } from '../services/authService';
import { mapError } from '@backend/utils/response/mapError';
import { successResponse } from '@backend/utils/response/successResponse';
import {
  setPasswordSchema,
  createUserSchema,
} from '@backend/validation/schemas/auth';
import { parseBody } from '@backend/validation/utils/parseBody';

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

    const result = await service.createUser(
      parsed.data.email,
      parsed.data.name,
    );
    if (result.error) return mapError(result.error);

    return successResponse(result.data, 201);
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
    if (result.error) return mapError(result.error);

    return successResponse(result.data);
  },
});

export const authController = createAuthController(authService);
