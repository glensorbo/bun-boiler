-- ── E2E Schema ───────────────────────────────────────────────────────────────
-- Full schema for the e2e test database, derived from all Drizzle migrations.
-- Run automatically by Postgres on container init (docker-entrypoint-initdb.d).
-- ⚠️  Keep in sync with backend/db/migrations/ when new migrations are added.

CREATE TYPE "public"."user_role" AS ENUM ('admin', 'user');

CREATE TABLE "users" (
  "id"         uuid          PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email"      varchar(255)  NOT NULL,
  "password"   varchar(255)  NOT NULL,
  "name"       varchar(255)  NOT NULL,
  "role"       "user_role"   DEFAULT 'user' NOT NULL,
  "created_at" timestamp     DEFAULT now() NOT NULL,
  "updated_at" timestamp     DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE ("email")
);

CREATE TABLE "refresh_tokens" (
  "id"         uuid         PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id"    uuid         NOT NULL,
  "token_hash" varchar(64)  NOT NULL,
  "expires_at" timestamp    NOT NULL,
  "created_at" timestamp    DEFAULT now() NOT NULL,
  CONSTRAINT "refresh_tokens_token_hash_unique" UNIQUE ("token_hash")
);

ALTER TABLE "refresh_tokens"
  ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;
