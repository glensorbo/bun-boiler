import { logger } from '@backend/features/telemetry/logger';

export const logRequest = (
  req: Request,
  res: Response,
  durationMs: number,
): void => {
  const ts = new Date().toISOString();
  const path = new URL(req.url).pathname;
  logger.info(
    `[${ts}] ${req.method} ${path} → ${res.status} (${Math.round(durationMs)}ms)`,
  );
};
