import type { AppErrorType } from './appErrorType';

export type AppError = {
  type: AppErrorType;
  message: string;
  field?: string;
};
