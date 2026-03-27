# 🏗️ Layout

Shell components that define the page structure. Not business-logic-aware.

| File             | Role                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| `pageLayout.tsx` | Top-level route component — composes `TopNav`, `LeftNav`, and `<Outlet />` |
| `constants.ts`   | Shared layout constants (e.g. `DRAWER_WIDTH`)                              |

## Notes

- `pageLayout.tsx` is the only file here allowed to import from `features/`.
- Keep layout components structurally focused — no API calls, no Redux slices.
