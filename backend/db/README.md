# Database

This directory contains all database-related code using [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL.

## Structure

```
server/db/
├── client.ts           # Database client factory with singleton pattern
├── schemas/           # Database schemas (table definitions)
│   └── users.ts       # User table schema
└── migrations/        # Auto-generated migration files
```

## Environment Setup

Before using the database, set the `DATABASE_URL` environment variable in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

The environment variable is typed in `bun-env.d.ts` for type-safe access via `Bun.env.DATABASE_URL`.

## Scripts

The following scripts are available in `package.json`:

- `bun run db:generate` - Generate migration files from schema changes
- `bun run db:migrate` - Apply migrations to the database
- `bun run db:push` - Push schema changes directly to the database (development only)
- `bun run db:studio` - Open Drizzle Studio (visual database browser)

## When to Generate Migrations

**ALWAYS generate migrations when you:**

- Create a new table (add a new schema file)
- Add, remove, or rename columns in existing tables
- Change column types (e.g., varchar → text)
- Modify column constraints (e.g., add/remove notNull, unique)
- Add or remove foreign key relationships
- Change default values
- Add or remove indexes

**DO NOT generate migrations for:**

- TypeScript type-only changes (e.g., updating exported types)
- Code comments or documentation
- Import statement reorganization

## Migration Workflow

### Development Workflow

1. **Make schema changes** in your schema files (e.g., `server/db/schemas/users.ts`)

2. **Generate migration:**

   ```bash
   bun run db:generate
   ```

   This creates a new SQL migration file in `server/db/migrations/` with a timestamp.

3. **Review the migration:**
   - Open the generated SQL file in `server/db/migrations/`
   - Verify the SQL matches your intended changes
   - Check for any destructive operations (DROP, ALTER, etc.)

4. **Apply the migration:**

   ```bash
   bun run db:migrate
   ```

   This runs the migration against your database.

5. **Commit the migration to git:**
   ```bash
   git add server/db/migrations/
   git add server/db/schemas/
   git commit -m "feat: add X column to Y table"
   ```

### Production Workflow

Migrations are applied automatically during deployment. The CI/CD pipeline runs:

```bash
bun run db:migrate
```

**Note:** Never use `bun run db:push` in production - it bypasses migrations and can cause data loss.

## Usage

### Importing the database

```typescript
import { getDb } from '@server/db/client';
import { users } from '@server/db/schemas/users';

// Get database instance (cached, only connects once)
const db = getDb();
```

**Note**: The database client uses a singleton pattern - the first call to `getDb()` creates the connection, subsequent calls return the cached instance. This means tests that don't call `getDb()` won't require a database connection.

### Querying data

```typescript
// Select all users
const db = getDb();
const allUsers = await db.select().from(users);

// Select specific user by email
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'));

// Insert a new user
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  password: 'hashed_password',
  name: 'John Doe',
});
```

## Schema Conventions

- **File names**: Use `camelCase` for schema files (e.g., `users.ts`, `userSessions.ts`, `blogPosts.ts`)
- **Table names**: Use `snake_case` in SQL (e.g., `users`, `user_sessions`, `blog_posts`)
- **Primary keys**: Use UUID with `defaultRandom()` for auto-generation
- **Timestamps**: Include `createdAt` and `updatedAt` fields where appropriate
- **No index files**: Import schemas directly from their files (e.g., `import { users } from "@/server/db/schemas/users"`)

## Creating a New Schema

1. Create a new file in `server/db/schemas/` using camelCase (e.g., `blogPosts.ts`)
2. Define your table using Drizzle's schema builder:

```typescript
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
```

3. Import the schema in `server/db/client.ts` and add it to the schema object:

```typescript
import { users } from './schemas/users';
import { blogPosts } from './schemas/blogPosts';

const schema = { users, blogPosts };
export const db = drizzle(client, { schema });
```

4. **Generate and apply migration:**

```bash
bun run db:generate
bun run db:migrate
```

## Best Practices

### ✅ DO

- **Always review generated SQL** before running migrations
- **Commit migrations to git** alongside schema changes
- **Use descriptive migration names** (Drizzle auto-generates from timestamp)
- **Test migrations locally** before pushing to production
- **Use transactions** for complex data migrations
- **Add indexes** for frequently queried columns
- **Document breaking changes** in commit messages

### ❌ DON'T

- **Don't use `db:push` in production** - it's for rapid prototyping only
- **Don't edit old migrations** - create new ones to fix issues
- **Don't skip reviewing SQL** - it might drop data unexpectedly
- **Don't delete migrations** - production databases depend on them
- **Don't commit schema changes without migrations**

## Troubleshooting

### Migration generation fails

- Ensure `DATABASE_URL` is set correctly in `.env`
- Check that schema files have valid syntax
- Verify all imported tables exist

### Migration apply fails

- Check database connection (can you connect with psql?)
- Look for SQL syntax errors in the migration file
- Check if migration was already applied (`drizzle` meta table)

### Schema drift detected

If your database doesn't match your schema:

```bash
# Generate a migration to fix the drift
bun run db:generate

# Or force-push in development (CAUTION: can lose data)
bun run db:push
```

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Column Types](https://orm.drizzle.team/docs/column-types/pg)
