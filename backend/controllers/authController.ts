import { authService } from '../services/authService';
import { serviceErrorResponse } from '@backend/utils/response/serviceErrorResponse';
import { successResponse } from '@backend/utils/response/successResponse';
import { validationErrorResponse } from '@backend/utils/response/validationErrorResponse';
import {
  setPasswordSchema,
  createUserSchema,
} from '@backend/validation/schemas/auth';
import { validateRequest } from '@backend/validation/utils/validateRequest';

import type { authService as AuthServiceType } from '../services/authService';
import type { BunRequest, Ctx } from '@backend/middleware';
import type { AppJwtPayload } from '@backend/types/appJwtPayload';

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
    const validation = await validateRequest(createUserSchema, req);
    if (validation.errors) {
      return validationErrorResponse('Validation failed', validation.errors);
    }

    const result = await service.createUser(
      validation.data.email,
      validation.data.name,
    );

    if (result.error) {
      return serviceErrorResponse(result.error);
    }

    return successResponse(result.data, 201);
  },

  /**
   * POST /api/auth/set-password
   * New user sets their password using the signup JWT from their invite link.
   * Returns a regular auth JWT on success.
   */
  async setPassword(req: BunRequest, ctx: Ctx): Promise<Response> {
    const validation = await validateRequest(setPasswordSchema, req);
    if (validation.errors) {
      return validationErrorResponse('Validation failed', validation.errors);
    }

    const { sub } = ctx.user as AppJwtPayload;
    const result = await service.setPassword(sub, validation.data.password);
    if (result.error) {
      return serviceErrorResponse(result.error);
    }

    return successResponse(result.data);
  },
});

export const authController = createAuthController(authService);
