import { z } from 'zod';

import { mapZodErrors } from './mapZodErrors';

import type { ValidationResult } from '@backend/types/validationResult';

export const validateParam = <T>(
  schema: z.ZodSchema<T>,
  value: unknown,
): ValidationResult<T> => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { data: result.data, errors: null };
  }
  return { data: null, errors: mapZodErrors(result.error) };
};
