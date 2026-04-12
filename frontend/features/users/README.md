# 👥 users

Admin user management feature: list, invite, role change, delete, and password reset.

## Files

| File                              | Purpose                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| `components/usersPanel.tsx`       | Main table panel: role selector, delete, and password reset per row |
| `components/deleteUserDialog.tsx` | Confirmation dialog for user deletion                               |
| `components/inviteUserDialog.tsx` | Form dialog to invite a new user (generates a signup link)          |
| `components/signupLinkDialog.tsx` | Displays the generated signup link after invite or password reset   |
| `state/usersApi.ts`               | RTK Query endpoints for all `/api/user` and invite mutations        |

## Rules

- Must not be rendered for non-admin users; the `/users` route is admin-only.
- Must use `useSelector(selectUserId)` to guard against self-deletion in `usersPanel.tsx`.
- Must not import from sibling feature folders; use `@frontend/shared/` for cross-cutting components.
- Signup links returned by invite and reset-password must only be shown once via `signupLinkDialog.tsx`.
