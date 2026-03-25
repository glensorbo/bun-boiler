import { z } from 'zod';

import { mapZodErrors } from './mapZodErrors';
import { validationError } from '@backend/utils/response/validationError';

export const parseBody = <T>(
  schema: z.ZodSchema<T>,
  body: unknown,
): { success: true; data: T } | { success: false; response: Response } => {
  const result = schema.safeParse(body);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    response: validationError('Validation failed', mapZodErrors(result.error)),
  };
};
