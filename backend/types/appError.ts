export type AppErrorType =
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'unauthorized';

export type AppError = {
  type: AppErrorType;
  message: string;
  field?: string;
};
