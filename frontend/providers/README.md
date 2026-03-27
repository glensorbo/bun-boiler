# 🎨 Providers

React context providers that wrap the application in `main.tsx`.
Each provider owns a single cross-cutting concern.

| File                | Concern                                          |
| ------------------- | ------------------------------------------------ |
| `themeProvider.tsx` | MUI theme, system/light/dark mode, `CssBaseline` |

## Adding a provider

1. Create `myProvider.tsx` here.
2. Wrap it around `<AppRouter />` in `main.tsx` (outer = less dependent on store).
3. Add a row to the table above.
