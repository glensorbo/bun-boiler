import type { ApiErrorResponse } from '@backend/types/apiErrorResponse';
import type { SerializedError } from '@reduxjs/toolkit';

type ErrorOr<T> =
  | { data: T; error: null }
  | { data: null; error: ApiErrorResponse };

/**
 * Narrows an RTK Query mutation/query result into a clean discriminated union.
 * Use `result.data` to access the success value, `result.error` for failures.
 */
export function errorOr<T>(result: {
  data?: T;
  error?: ApiErrorResponse | SerializedError;
}): ErrorOr<T> {
  if (result.data !== undefined && result.data !== null) {
    return { data: result.data, error: null };
  }
  return { data: null, error: result.error as ApiErrorResponse };
}
