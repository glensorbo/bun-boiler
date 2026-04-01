# 🔝 topNav

Top application bar for the dashboard shell.

| Path                                 | Purpose                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `components/topNav.tsx`              | Sticky top bar with shell title, search, primary action, and nav toggle |
| `components/userMenu.tsx`            | Account menu entry point                                                |
| `components/changePasswordModal.tsx` | Password change flow from the user menu                                 |
| `components/setPasswordModal.tsx`    | Password setup flow from the user menu                                  |
| `hooks/`, `logic/`, `tests/`         | Feature-scoped helpers and coverage for the top bar                     |

## Rules

- Must stay global; page-specific filters, tabs, and KPI chips belong in page content.
- Must use shared theme tokens and MUI styling; must not introduce one-off shell colors.
- Must keep primary actions broad enough to make sense across the app shell.
- Must not duplicate left-nav navigation or page body actions.

See `../../layout/README.md` for shell composition rules.
