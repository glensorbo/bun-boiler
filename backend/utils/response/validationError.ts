import type { ApiErrorResponse, FieldError } from '@backend/types/errors';

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
