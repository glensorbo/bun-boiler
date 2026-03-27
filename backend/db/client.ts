import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { users } from './schemas/users';

/**
 * Database client singleton
 * Cached to avoid creating multiple connections
 */
let cachedClient: postgres.Sql | null = null;
let cachedDb: ReturnType<typeof drizzle> | null = null;

/**
 * Get database client
 * Creates a new client if none exists, otherwise returns cached client
 * @returns Drizzle database instance
 */
export const getDb = () => {
  // Return cached instance if it exists
  if (cachedDb) {
    return cachedDb;
  }

  // Build connection string from individual environment variables
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

  // Create postgres connection
  cachedClient = postgres(connectionString);

  // Create drizzle instance with all schemas
  const schema = { users };
  cachedDb = drizzle(cachedClient, { schema });

  console.log('🔌 Database connection established');

  return cachedDb;
};
