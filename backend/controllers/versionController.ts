import { successResponse } from '@backend/utils/response';

export const versionController = {
  getVersion(): Response {
    return successResponse({
      version: Bun.env.BUN_PUBLIC_APP_VERSION ?? 'dev',
      environment: Bun.env.BUN_PUBLIC_APP_ENV ?? 'dev',
    });
  },
};
