import type { ErrorType } from './errorType';
import type { FieldError } from './fieldError';

export type ApiErrorResponse = {
  message: string;
  status: number;
  error: {
    type: ErrorType;
    errors: FieldError[];
    details?: string;
  };
};
