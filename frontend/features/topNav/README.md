# 🔝 topNav

Top application bar for the dashboard shell.

| Path                                 | Purpose                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `components/topNav.tsx`              | Sticky top bar with shell title, search, primary action, and nav toggle                     |
| `components/userMenu.tsx`            | Glassmorphic pill trigger + dropdown with profile header, inline theme toggle, and sign out |
| `components/changePasswordModal.tsx` | Password change flow from the user menu                                                     |
| `components/setPasswordModal.tsx`    | Password setup flow from the user menu                                                      |
| `hooks/`, `logic/`, `tests/`         | Feature-scoped helpers and coverage for the top bar                                         |

## UserMenu structure

| Part            | Detail                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Pill trigger    | `ButtonBase` — glassmorphic border + blur; shows 28 px DiceBear avatar, display name (sm+), role label (md+), rotating chevron |
| Profile header  | 44 px DiceBear avatar seeded by email, bold display name, email, role `Chip` (red for `admin`)                                 |
| Theme toggle    | Inline `ToggleButtonGroup` — System / Light / Dark icons, exclusive selection                                                  |
| Password action | "Set password" (signup token) or "Change password" (auth token)                                                                |
| Sign out        | Red-tinted `MenuItem` (`color: error.main`)                                                                                    |

DiceBear URL: `https://api.dicebear.com/9.x/thumbs/svg?seed=<email>`

Selectors consumed from `@frontend/features/login/state/authSlice`: `selectUserName`, `selectUserEmail`, `selectUserRole`.

## Rules

- Must stay global; page-specific filters, tabs, and KPI chips belong in page content.
- Must use shared theme tokens and MUI styling; must not introduce one-off shell colors.
- Must keep primary actions broad enough to make sense across the app shell.
- Must not duplicate left-nav navigation or page body actions.

See `../../layout/README.md` for shell composition rules.
