import { op } from '@frontend/features/analytics/analyticsProvider';

/**
 * Hook for tracking custom analytics events.
 * Always safe to call — no-op when OpenPanel is not configured.
 */
export const useAnalytics = () => ({
  trackEvent: (
    name: string,
    props?: Record<string, string | number | boolean>,
  ) => {
    op?.track(name, props);
  },
  identify: (profileId: string, props?: Record<string, unknown>) => {
    op?.identify({ profileId, ...props });
  },
  clear: () => {
    op?.clear();
  },
});
