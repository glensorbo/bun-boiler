-- ── E2E Seed Data ────────────────────────────────────────────────────────────
-- Test users for the e2e suite. Passwords are Argon2id hashes of the known
-- test credentials defined in docker-compose.e2e.yml (and global-setup.ts defaults).
--
-- Admin user
--   email:    admin@e2e.local
--   password: e2e-admin-password-local-only
--
-- E2E test user (used by Playwright global-setup to obtain a Bearer token)
--   email:    e2e-playwright@local.test
--   password: correct-horse-battery-staple-purple-elephant-dancing-at-midnight-with-seven-golden-penguins-in-antarctica-42

INSERT INTO "users" (email, password, name, role) VALUES
  (
    'admin@e2e.local',
    '$argon2id$v=19$m=65536,t=2,p=1$vEYIsDAlIbQvaVEq4P4pbNfOYtUmc2FGoDFMoR/gzyI$cWpLvO47Q4rsknmXItXNE32igdXWG1I1FRo5Ijve5H0',
    'E2E Admin',
    'admin'
  ),
  (
    'e2e-playwright@local.test',
    '$argon2id$v=19$m=65536,t=2,p=1$wg15yyEEfx0uQdqsYFHs3viAdxC/C4ZHCCUcEgExF18$4d6dU/zbA6AQid2h1cFhyDz6l2aAIPpqqPKnXBgvvb0',
    'Playwright E2E User',
    'user'
  );
