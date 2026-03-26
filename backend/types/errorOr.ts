/**
 * ErrorOr — a generic result type for service layer operations.
 *
 * Services return ErrorOr<T> instead of throwing. Controllers check
 * result.error and either return the mapped HTTP response or proceed
 * with result.data.
 *
 * @example
 * // In a service:
 * async getUser(id: string): Promise<ErrorOr<User>> {
 *   const user = await repo.getById(id);
 *   if (!user) return failure([{ type: 'not_found', message: 'User not found' }]);
 *   return success(user);
 * }
 *
 * // In a controller:
 * const result = await service.getUser(id);
 * if (result.error) return serviceErrorResponse(result.error);
 * return successResponse(result.data);
 */

import type { AppError } from './appError';

export type ErrorOr<T> =
  | { data: T; error: null }
  | { data: null; error: AppError[] };

export const success = <T>(data: T): ErrorOr<T> => ({ data, error: null });

export const failure = <T>(errors: AppError[]): ErrorOr<T> => ({
  data: null,
  error: errors,
});
