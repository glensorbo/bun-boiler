import {
  uuidSchema,
  updateRoleSchema,
} from '@backend/features/validation/schemas/user';
import { validateParam } from '@backend/features/validation/utils/validateParam';
import { validateRequest } from '@backend/features/validation/utils/validateRequest';
import {
  notFoundError,
  serviceErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@backend/utils/response';

import type { userService as UserServiceType } from '@backend/services/userService';

/**
 * User Controller Factory
 * Accepts service as dependency for testability
 */
export const createUserController = (service: typeof UserServiceType) => ({
  async getUsers(): Promise<Response> {
    const users = await service.getAllUsers();
    return successResponse(users);
  },

  async getUserById(id: string): Promise<Response> {
    const validation = validateParam(uuidSchema, id);
    if (validation.errors) {
      return validationErrorResponse('Validation failed', validation.errors);
    }

    const user = await service.getUserById(validation.data);

    if (!user) {
      return notFoundError('User not found', `No user found with ID: ${id}`);
    }

    return successResponse(user);
  },

  async deleteUser(requestingUserId: string, id: string): Promise<Response> {
    const validation = validateParam(uuidSchema, id);
    if (validation.errors) {
      return validationErrorResponse('Validation failed', validation.errors);
    }

    const result = await service.deleteUser(requestingUserId, validation.data);
    if (result.error) {
      return serviceErrorResponse(result.error);
    }
    return successResponse(null, 204);
  },

  async updateUserRole(
    requestingUserId: string,
    id: string,
    req: Request,
  ): Promise<Response> {
    const idValidation = validateParam(uuidSchema, id);
    if (idValidation.errors) {
      return validationErrorResponse('Validation failed', idValidation.errors);
    }

    const bodyValidation = await validateRequest(updateRoleSchema, req);
    if (bodyValidation.errors) {
      return validationErrorResponse(
        'Validation failed',
        bodyValidation.errors,
      );
    }

    const result = await service.updateUserRole(
      requestingUserId,
      idValidation.data,
      bodyValidation.data.role,
    );
    if (result.error) {
      return serviceErrorResponse(result.error);
    }
    return successResponse(result.data);
  },

  async resetUserPassword(id: string): Promise<Response> {
    const validation = validateParam(uuidSchema, id);
    if (validation.errors) {
      return validationErrorResponse('Validation failed', validation.errors);
    }

    const result = await service.resetUserPassword(validation.data);
    if (result.error) {
      return serviceErrorResponse(result.error);
    }
    return successResponse(result.data);
  },
});
