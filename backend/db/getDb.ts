import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { refreshTokens } from './schemas/refreshTokens';
import { users } from './schemas/users';
import { logger } from '@backend/features/telemetry/logger';

let cachedClient: postgres.Sql | null = null;
let cachedDb: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (cachedDb) {
    return cachedDb;
  }

  const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_SERVER, POSTGRES_DB } =
    Bun.env;

  if (
    !POSTGRES_USER ||
    !POSTGRES_PASSWORD ||
    !POSTGRES_SERVER ||
    !POSTGRES_DB
  ) {
    throw new Error(
      'Missing required database environment variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_SERVER, POSTGRES_DB',
    );
  }

  const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}/${POSTGRES_DB}`;

  cachedClient = postgres(connectionString, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    onnotice: () => {},
  });

  const schema = { users, refreshTokens };
  cachedDb = drizzle(cachedClient, { schema });

  logger.info('🔌 Database connection established');

  return cachedDb;
};
