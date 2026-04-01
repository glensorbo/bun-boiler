# ⚛️ Frontend

React dashboard UI: app shell, route pages, providers, and shared primitives.

| Path         | Purpose                                                       |
| ------------ | ------------------------------------------------------------- |
| `config.ts`  | Single source of truth for `BUN_PUBLIC_*` vars                |
| `providers/` | App-wide providers, including the token-based MUI theme       |
| `layout/`    | Dashboard shell that composes the nav chrome and route outlet |
| `pages/`     | Thin route files; `homePage.tsx` is the showcase dashboard    |
| `shared/`    | Reusable dashboard building blocks with no business logic     |
| `features/`  | Feature modules, including the shell nav features             |

## React Compiler

Active in all three environments — there is no mode where it is off:

| Environment | Mechanism                                                         |
| ----------- | ----------------------------------------------------------------- |
| Dev         | `bun-plugin-react-compiler` via `[serve.static]` in `bunfig.toml` |
| Production  | `babel-plugin-react-compiler` custom Bun plugin in `build.ts`     |
| Lint        | `eslint-plugin-react-compiler` in `eslint.config.js`              |

Violations are hard errors — they will block `bun dev`, `bun run build`, and `bun run cc`.

## Rules

- Must start new dashboard UI work in `shared/README.md` and `providers/README.md`.
- Must compose pages from shared dashboard primitives before creating bespoke shells or cards.
- Must use theme tokens from `providers/theme.ts`; must not hard-code surface, border, sidebar, gradient, or chart colors.
- Must keep pages thin and feature modules isolated.
- Must add new `BUN_PUBLIC_*` vars to `config.ts`; must not read `import.meta.env` anywhere else.

## See also

- `./shared/README.md`
- `./providers/README.md`
- `./layout/README.md`
- `./pages/README.md`
