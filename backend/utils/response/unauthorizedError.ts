import type { ApiErrorResponse } from '@backend/types/errors';

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
