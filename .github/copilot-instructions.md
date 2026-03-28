# Copilot Instructions

This is a full-stack Bun app: React 19 frontend + layered backend (Controller → Service → Repository) → Drizzle ORM → PostgreSQL.

## ⚡ Runtime — Bun Only

- Use `bun` everywhere — never `node`, `npm`, `npx`, `ts-node`, or `yarn`
- Bun auto-loads `.env` — never use `dotenv`
- Use `Bun.file` instead of `fs.readFile`/`fs.writeFile`
- Use `Bun.$\`cmd\``instead of`execa`

## 🎨 Style

- Use emojis where appropriate in terminal output, commit messages, and docs
- Only comment code that genuinely needs clarification — no redundant comments

## 📚 READMEs

Every major directory has a README. **Read it before working in that layer.**

## ✅ After Every Change

Always run as the final step:

```sh
bun run cc   # test + lint + compiler check + format check + knip
```

If formatting fails: `bun run format`. Fix all other errors at source.

## 🔑 Key Commands

```sh
bun dev              # Dev server with HMR
bun run build        # Bundle frontend to dist/
bun test             # Run all unit tests
bun run cc           # Full check suite
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Apply migrations
bun run db:studio    # Open Drizzle Studio
```

## 🔗 Path Aliases

Use these when crossing layer boundaries — never use `../../` relative imports:

- `@backend/*` → `./backend/*`
- `@frontend/*` → `./frontend/*`
- `@type/*` → `./types/*`

## 🔐 Env Vars

Whenever an env var is added, removed, or renamed — update **both** `.env.example` and `bun-env.d.ts`.

## 🌐 Routes

Whenever a route or controller is added, changed, or removed — update the corresponding file in `rest/` and `rest/README.md` if the file table changes.
