# 🗄️ Database

All database-related code using [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL.

## 📁 Structure

```
backend/db/
├── client.ts        # Database client — singleton pattern
├── schemas/         # Table definitions (source of truth for all types)
│   └── users.ts
└── migrations/      # Auto-generated SQL migration files
```

## 🔌 Environment Setup

Set `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
```

Typed for `Bun.env.DATABASE_URL` via `bun-env.d.ts`.

## 🔑 Database Client

Always access the database via `getDb()` from `@backend/db/client`. It creates the connection on first call and caches it — subsequent calls return the same instance:

```ts
import { getDb } from '@backend/db/client';
import { users } from '@backend/db/schemas/users';

const db = getDb();
const allUsers = await db.select().from(users);
```

Register every new schema in the schema object inside `client.ts`:

```ts
import { users } from './schemas/users';
import { blogPosts } from './schemas/blogPosts';

cachedDb = drizzle(cachedClient, { schema: { users, blogPosts } });
```

## 📐 Schema Conventions

- **File names**: `camelCase` (e.g., `users.ts`, `blogPosts.ts`)
- **SQL table names**: `snake_case` (e.g., `users`, `blog_posts`)
- **Primary keys**: UUID with `defaultRandom()`
- **Timestamps**: Always include `createdAt` and `updatedAt`
- **Types**: Defined in `backend/types/` using `$inferSelect` / `$inferInsert` — never in the schema file itself

## ➕ Creating a New Schema

1. Create `backend/db/schemas/myResource.ts`:

```ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const myResources = pgTable('my_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

2. Add types to `backend/types/myResource.ts`:

```ts
import { myResources } from '@backend/db/schemas/myResource';

export type MyResource = typeof myResources.$inferSelect;
export type NewMyResource = typeof myResources.$inferInsert;
```

3. Register in `backend/db/client.ts`:

```ts
const schema = { users, myResources };
```

4. Generate and apply migration:

```bash
bun run db:generate
bun run db:migrate
```

## 🔄 Migration Workflow

### When to generate migrations

Always generate a migration when you:

- Create a new table
- Add, remove, or rename columns
- Change column types or constraints
- Add or remove foreign keys or indexes

### Development

```bash
bun run db:generate   # Creates a new SQL file in backend/db/migrations/
bun run db:migrate    # Applies it to your database
```

Review the generated SQL before applying — check for unexpected `DROP` or `ALTER` statements.

### Production

Run `bun run db:migrate` during deployment. **Never use `db:push` in production** — it bypasses migrations and can cause data loss.

## 🛠️ Drizzle Studio

```bash
bun run db:studio   # Visual browser for your database at https://local.drizzle.studio
```
