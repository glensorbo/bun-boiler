# ⚛️ Frontend

React 19 frontend built and served by Bun with zero configuration — no Vite, no Webpack.

## 📁 Structure

```
frontend/
├── main.tsx        # Entry point — mounts React root, handles HMR
├── App.tsx         # Root application component
└── test-setup.ts   # Registers happy-dom globally for all tests
```

## 🔧 How It Works

### Development

`backend/server.ts` imports `public/index.html` directly and serves it via `Bun.serve()`. Bun automatically transpiles any `.tsx`/`.ts` files referenced in the HTML and enables HMR:

```ts
import index from '../public/index.html';
// ...
'/*': index  // Bun handles bundling + HMR automatically
```

`main.tsx` uses `import.meta.hot` to preserve the React root between hot reloads:

```ts
if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
}
```

### Production

`bun run build` runs `build.ts`, which scans `frontend/` for all `.html` files, runs them through Bun's bundler with the React Compiler plugin, and outputs minified assets to `dist/`. The backend then serves from `dist/` with SPA fallback.

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
