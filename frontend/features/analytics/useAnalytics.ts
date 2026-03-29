import rybbit from '@rybbit/js';

const isEnabled = Boolean(
  Bun.env.BUN_PUBLIC_RYBBIT_HOST && Bun.env.BUN_PUBLIC_RYBBIT_SITE_ID,
);

/**
 * Hook for tracking custom analytics events.
 * Always safe to call — no-op when Rybbit is not configured.
 */
export const useAnalytics = () => ({
  trackEvent: (
    name: string,
    props?: Record<string, string | number | boolean>,
  ) => {
    if (isEnabled) {
      rybbit.event(name, props);
    }
  },
  trackPageview: () => {
    if (isEnabled) {
      rybbit.pageview();
    }
  },
});
