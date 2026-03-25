import type { ApiErrorResponse } from '@backend/types/errors';

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
