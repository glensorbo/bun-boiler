/**
 * Safe access to BUN_PUBLIC_* env vars for frontend (browser) code.
 *
 * Priority: window.__APP_CONFIG__ (runtime, injected by the server) takes
 * precedence over import.meta.env (build-time, inlined by the bundler).
 * This ensures deployments that supply env vars at runtime (e.g. Coolify)
 * work correctly even when the Docker image was built without those vars.
 *
 * Never access import.meta.env or window.__APP_CONFIG__ directly outside this file.
 */
const runtimeConfig =
  typeof window !== 'undefined' ? window.__APP_CONFIG__ : undefined;
const env = import.meta.env as ImportMetaEnv | undefined;

export const config = {
  openpanel: {
    clientId:
      runtimeConfig?.BUN_PUBLIC_OPENPANEL_CLIENT_ID ||
      env?.BUN_PUBLIC_OPENPANEL_CLIENT_ID ||
      null,
    apiUrl:
      runtimeConfig?.BUN_PUBLIC_OPENPANEL_API_URL ||
      env?.BUN_PUBLIC_OPENPANEL_API_URL ||
      null,
  },
  otel: {
    /**
     * Service name reported in browser traces.
     * Set BUN_PUBLIC_OTEL_SERVICE_NAME to enable frontend tracing
     * (e.g. "bun-boiler-frontend"). When null, the frontend OTel SDK is
     * never loaded. Spans are proxied via /api/telemetry/traces.
     */
    serviceName:
      runtimeConfig?.BUN_PUBLIC_OTEL_SERVICE_NAME ||
      env?.BUN_PUBLIC_OTEL_SERVICE_NAME ||
      null,
  },
  /** Whether self-service signup is enabled. Set BUN_PUBLIC_ENABLE_SIGNUP=true to enable. */
  enableSignup:
    (runtimeConfig?.BUN_PUBLIC_ENABLE_SIGNUP ||
      env?.BUN_PUBLIC_ENABLE_SIGNUP) === 'true',
} as const;
