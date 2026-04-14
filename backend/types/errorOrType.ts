import type { AppError } from './appError';

export type ErrorOr<T> =
  | { data: T; error: null }
  | { data: null; error: AppError[] };
