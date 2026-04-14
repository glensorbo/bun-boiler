import { sql } from 'drizzle-orm';
import { getDb } from './getDb';
import { logger } from '@backend/features/telemetry/logger';

const PING_RETRIES = 5;
const PING_BASE_DELAY_MS = 1_000;

/**
 * Verifies the database is reachable by running SELECT 1.
 * Retries with exponential backoff up to PING_RETRIES times.
 * Throws if the database is unreachable after all attempts.
 */
export const pingDb = async (): Promise<void> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= PING_RETRIES; attempt++) {
    try {
      await getDb().execute(sql`SELECT 1`);
      return;
    } catch (err) {
      lastError = err;
      const delayMs = PING_BASE_DELAY_MS * 2 ** (attempt - 1);
      logger.warn(
        `⚠️  DB connection attempt ${attempt}/${PING_RETRIES} failed. Retrying in ${delayMs}ms…`,
      );
      await Bun.sleep(delayMs);
    }
  }

  logger.error(
    `❌ Failed to connect to the database after ${PING_RETRIES} attempts`,
  );
  throw lastError;
};
