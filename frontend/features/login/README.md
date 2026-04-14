# 🔐 login

Handles user authentication: the login form, auth state (JWT token), and route protection.

## Structure

- `components/loginForm.tsx` — email/password form with `onSubmitHandler`, error display, validation, and optional "Create account" link
- `components/protectedRoute.tsx` — redirects unauthenticated users to `/login`
- `hooks/useLogin.ts` — wraps the login mutation, dispatches token on success
- `logic/loginSchema.ts` + `validateLoginForm.ts` — client-side validation helpers
- `state/authSlice.ts` — Redux slice storing the JWT token (persisted to localStorage)
- `state/loginFormSlice.ts` — ephemeral form state (field values, submission status)

## Auth flow

1. Unauthenticated visit → `ProtectedRoute` redirects to `/login`
2. User submits form → `useLogin` calls the API → token stored in Redux + localStorage
3. `AuthProvider` (in `providers/`) decodes token on mount and clears it if expired
4. `/login` visited while authenticated → `LoginPage` redirects to `/`

## Signup link

When `config.enableSignup` is `true`, `loginForm.tsx` renders a "Create account" link below the form pointing to `/signup`. The link is absent when signup is disabled — no dead links in invite-only mode.
