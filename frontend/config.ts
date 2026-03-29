/**
 * Safe access to BUN_PUBLIC_* env vars for frontend (browser) code.
 *
 * import.meta.env can be undefined in production when no BUN_PUBLIC_* vars
 * are set, so all reads go through optional chaining with null fallbacks.
 * Never access import.meta.env directly outside this file.
 */
const env = import.meta.env as ImportMetaEnv | undefined;

export const config = {
  rybbit: {
    host: env?.BUN_PUBLIC_RYBBIT_HOST ?? null,
    siteId: env?.BUN_PUBLIC_RYBBIT_SITE_ID ?? null,
  },
} as const;
