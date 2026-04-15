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

| Environment | Mechanism                                                     |
| ----------- | ------------------------------------------------------------- |
| Production  | `babel-plugin-react-compiler` custom Bun plugin in `build.ts` |
| Lint        | `eslint-plugin-react-compiler` in `eslint.config.js`          |

Dev hot-reload does not run the compiler — `bun-plugin-react-compiler` is incompatible with the MUI `sx` theme-callback pattern used in this project. Compiler compliance is enforced at lint time (`bun run cc`) and applied at build time.

## Rules

- Must start new dashboard UI work in `shared/README.md` and `providers/README.md`.
- Must compose pages from shared dashboard primitives before creating bespoke shells or cards.
- Must use theme tokens from `providers/theme.ts`; must not hard-code surface, border, sidebar, gradient, or chart colors.
- Must keep pages thin and feature modules isolated.
- Must add new `BUN_PUBLIC_*` vars to `config.ts`; must not read `import.meta.env` anywhere else.

## See also

```ts
if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
}
```

### Production

`bun run build` runs `build.ts`, which scans `frontend/` for all `.html` files, runs them through Bun's bundler with the React Compiler plugin, and outputs minified assets to `dist/`. The backend then serves from `dist/` with SPA fallback.

## ⚡ Code Splitting

`build.ts` runs with `splitting: true`, which tells Bun's bundler to emit a separate JS chunk for each lazy boundary.

All 6 route pages are lazy-loaded via `React.lazy()` in `router.tsx`:

```ts
const HomePage = React.lazy(() => import('@frontend/pages/homePage'));
```

A single `<Suspense fallback={null}>` at the router level covers every lazy page load — there are no per-route wrappers.

**Rules:**

- Must export each page both as a **named export** and a **default export** — `React.lazy()` requires a default export; the named export is used for non-lazy imports (e.g. tests).
- Must not add per-route `<Suspense>` wrappers — the top-level boundary in `router.tsx` is the only one.
- Must not import page components directly in `router.tsx` — all pages must go through `React.lazy()` to preserve chunk splitting.

## 🛡️ Error Handling

`frontend/shared/components/errorBoundary.tsx` wraps the app root. If a component throws during render, the boundary catches it and displays a fallback UI with a **Reset** button. Import and use `<ErrorBoundary>` from `@frontend/shared/components/errorBoundary`.

## 💀 Loading States

Prefer **skeleton loaders** over spinners for content that maps to a known layout. Shared skeletons live in `frontend/shared/components/skeleton.tsx`:

| Component       | Use case                           |
| --------------- | ---------------------------------- |
| `TableSkeleton` | Data tables while rows are loading |
| `ListSkeleton`  | List items while data is fetching  |
| `CardSkeleton`  | Card/panel content                 |

Import from `@frontend/shared/components/skeleton`.

## 🧪 Testing

Frontend tests use `happy-dom` for DOM APIs. It's registered globally via `frontend/test-setup.ts`, which is preloaded by Bun for all tests (configured in `bunfig.toml`):

```toml
[test]
preload = ["./frontend/test-setup.ts"]
```

## ⚙️ React Compiler

The build pipeline includes the React Compiler (`babel-plugin-react-compiler`), which automatically optimises components. The ESLint plugin (`eslint-plugin-react-compiler`) catches violations at lint time — run `bun run lint:compiler` to check.

## 🌍 Environment Variables

Client-side env vars must be prefixed with `BUN_PUBLIC_` to be exposed to the browser (configured in `bunfig.toml`):

```toml
[serve.static]
env = "BUN_PUBLIC_*"
```

### Config pattern

`frontend/config.ts` is the **single source of truth** for all `BUN_PUBLIC_*` vars. It wraps `import.meta.env` with optional chaining so missing vars fall back to `null` rather than throwing at runtime:

```ts
const runtimeConfig =
  typeof window !== 'undefined' ? window.__APP_CONFIG__ : undefined;
const env = import.meta.env as ImportMetaEnv | undefined;

export const config = {
  openpanel: {
    clientId:
      runtimeConfig?.BUN_PUBLIC_OPENPANEL_CLIENT_ID ||
      env?.BUN_PUBLIC_OPENPANEL_CLIENT_ID ||
      null,
    apiUrl:
      runtimeConfig?.BUN_PUBLIC_OPENPANEL_API_URL ||
      env?.BUN_PUBLIC_OPENPANEL_API_URL ||
      null,
  },
} as const;
```

- **Must** add new `BUN_PUBLIC_*` vars to `config.ts` — never read them elsewhere
- **Must not** access `import.meta.env` directly outside `config.ts`
- Import via `@frontend/config`: `import { config } from '@frontend/config'`

## 🗂️ See also

- `./shared/README.md`
- `./providers/README.md`
- `./layout/README.md`
- `./pages/README.md`
