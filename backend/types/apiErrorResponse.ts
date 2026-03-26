import type { FieldError } from './fieldError';

export type ErrorType = 'validation' | 'notFound' | 'unauthorized';

export type ApiErrorResponse = {
  message: string;
  status: number;
  error: {
    type: ErrorType;
    errors: FieldError[];
    details?: string;
  };
};
