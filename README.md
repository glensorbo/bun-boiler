# 🚀 bun-react-template

A full-stack boilerplate built on [Bun](https://bun.sh) with a React 19 frontend, layered backend architecture, and PostgreSQL via Drizzle ORM. Everything — runtime, bundler, test runner, package manager — is Bun.

## ✨ Features

- ⚡ **Bun** as runtime, bundler, test runner, and package manager
- ⚛️ **React 19** with HMR in development and optimized production builds
- 🗄️ **Drizzle ORM** with PostgreSQL
- 🏗️ **Layered backend** — Controller → Service → Repository
- 🧪 **Unit tests** with dependency injection (no database required)
- 🔍 **oxlint + oxfmt** for linting and formatting
- ⚙️ **React Compiler** via ESLint plugin
- 🐶 **Husky** pre-push hook that runs all checks before pushing

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.3+
- PostgreSQL database

## 🛠️ Setup

```bash
bun install
```

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
```

## 🧑‍💻 Development

```bash
bun dev        # Start dev server with HMR at http://localhost:3000
```

## 📦 Production

```bash
bun run build  # Bundle frontend to dist/
bun start      # Start production server
```

## 🗄️ Database

```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Apply migrations
bun run db:push      # Push schema directly (dev only)
bun run db:studio    # Open Drizzle Studio
```

## 🧪 Testing

```bash
bun test               # Run all tests
bun test <path>        # Run a single test file
bun test --watch       # Watch mode
```

## 🔍 Linting & Formatting

```bash
bun run lint           # oxlint (type-aware)
bun run lint:compiler  # ESLint React Compiler check
bun run format         # Auto-format with oxfmt
bun run format:check   # Check formatting only
bun run cc             # Full check suite (test + lint + format)
```

## 🏗️ Architecture

```
bun-react-template/
├── backend/              # Server-side code
│   ├── server.ts         # Bun.serve() entry point — defines all routes
│   ├── controllers/      # HTTP layer — parse request, return Response
│   ├── services/         # Business logic — data transformation
│   ├── repositories/     # Data access — Drizzle queries only
│   ├── db/               # Database client and schemas
│   ├── types/            # Shared TypeScript types (derived from schemas)
│   ├── utils/            # Shared utilities (error helpers)
│   └── test-helpers/     # Mock data and repositories for unit tests
├── frontend/             # React 19 app
│   ├── main.tsx          # Entry point, HMR setup
│   └── App.tsx           # Root component
├── public/               # Static assets and HTML entrypoint (dev)
├── build.ts              # Production build script
└── drizzle.config.ts     # Drizzle Kit config
```

See `backend/README.md` for a detailed breakdown of the backend architecture.
