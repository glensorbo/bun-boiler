/**
 * Error Types for API Responses
 * Provides consistent error handling across the application
 */

/**
 * Validation error for a specific field
 */
export type FieldError = {
  field: string;
  message: string;
};

/**
 * Error types supported by the API
 */
export type ErrorType = 'validation' | 'notFound' | 'unauthorized';

/**
 * Standard API error response structure
 */
export type ApiErrorResponse = {
  message: string;
  status: number;
  error: {
    type: ErrorType;
    errors: FieldError[]; // Field-specific errors (empty array if none)
    details?: string; // Optional additional details
  };
};

/**
 * Success response wrapper (for consistency)
 */
export type ApiSuccessResponse<T> = {
  data: T;
  status: number;
};
