import type { ApiErrorResponse, FieldError } from '@backend/types/errors';

/**
 * Error Response Helpers
 * Consistent error response builders for API handlers
 */

/**
 * Create a validation error response (400)
 * @param message - User-friendly error message
 * @param errors - Array of field-specific errors
 * @returns Response with validation error
 */
export const validationError = (
  message: string,
  errors: FieldError[],
): Response => {
  const body: ApiErrorResponse = {
    message,
    status: 400,
    error: {
      type: 'validation',
      errors,
    },
  };
  return Response.json(body, { status: 400 });
};

/**
 * Create a not found error response (404)
 * @param message - User-friendly error message
 * @param details - Optional additional details
 * @returns Response with not found error
 */
export const notFoundError = (message: string, details?: string): Response => {
  const body: ApiErrorResponse = {
    message,
    status: 404,
    error: {
      type: 'notFound',
      errors: [],
      details,
    },
  };
  return Response.json(body, { status: 404 });
};

/**
 * Create an unauthorized error response (401)
 * @param message - User-friendly error message
 * @param details - Optional additional details
 * @returns Response with unauthorized error
 */
export const unauthorizedError = (
  message: string,
  details?: string,
): Response => {
  const body: ApiErrorResponse = {
    message,
    status: 401,
    error: {
      type: 'unauthorized',
      errors: [],
      details,
    },
  };
  return Response.json(body, { status: 401 });
};

/**
 * Create a success response with data
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns Response with success data
 */
export const successResponse = <T>(data: T, status: number = 200): Response => {
  return Response.json(data, { status });
};
