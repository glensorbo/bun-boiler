/**
 * Safe access to BUN_PUBLIC_* env vars for frontend (browser) code.
 *
 * import.meta.env is always an object, but individual properties are
 * undefined when the corresponding BUN_PUBLIC_* var is not set. All reads
 * go through optional chaining with null fallbacks so callers always get a
 * typed string | null rather than string | undefined.
 *
 * Never access import.meta.env directly outside this file.
 */
const env = import.meta.env as ImportMetaEnv | undefined;

export const config = {
  rybbit: {
    host: env?.BUN_PUBLIC_RYBBIT_HOST ?? null,
    siteId: env?.BUN_PUBLIC_RYBBIT_SITE_ID ?? null,
  },
  otel: {
    /**
     * OTLP HTTP base URL for browser-side tracing.
     * Set BUN_PUBLIC_OTEL_ENDPOINT to enable (e.g. "http://localhost:4318").
     * When null, the frontend OTel SDK is never loaded.
     */
    endpoint: env?.BUN_PUBLIC_OTEL_ENDPOINT ?? null,
    /**
     * Service name reported in browser traces.
     * Defaults to "bun-boiler-frontend" when not set.
     */
    serviceName: env?.BUN_PUBLIC_OTEL_SERVICE_NAME ?? 'bun-boiler-frontend',
  },
} as const;
