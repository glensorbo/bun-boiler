import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './backend/db/schemas/*.ts',
  out: './backend/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: Bun.env.DATABASE_URL!,
  },
});
