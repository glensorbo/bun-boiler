/**
 * Safe access to BUN_PUBLIC_* env vars for frontend (browser) code.
 * Bun replaces process.env.BUN_PUBLIC_* with literal values at bundle time
 * in both dev (via [serve.static] env in bunfig.toml) and production builds.
 *
 * Never access process.env.BUN_PUBLIC_* directly outside this file.
 */
export const config = {
  openpanel: {
    clientId: process.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID ?? null,
    apiUrl: process.env.BUN_PUBLIC_OPENPANEL_API_URL ?? null,
  },
  otel: {
    /**
     * Service name reported in browser traces.
     * Set BUN_PUBLIC_OTEL_SERVICE_NAME to enable frontend tracing
     * (e.g. "bun-boiler-frontend"). When null, the frontend OTel SDK is
     * never loaded. Spans are proxied via /api/telemetry/traces.
     */
    serviceName: process.env.BUN_PUBLIC_OTEL_SERVICE_NAME ?? null,
  },
  /** Whether self-service signup is enabled. Set BUN_PUBLIC_ENABLE_SIGNUP=true to enable. */
  enableSignup: process.env.BUN_PUBLIC_ENABLE_SIGNUP === 'true',
} as const;
