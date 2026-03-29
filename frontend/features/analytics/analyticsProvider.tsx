import rybbit from '@rybbit/js';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const host = Bun.env.BUN_PUBLIC_RYBBIT_HOST;
const siteId = Bun.env.BUN_PUBLIC_RYBBIT_SITE_ID;
const isEnabled = Boolean(host && siteId);

if (isEnabled) {
  rybbit.init({ analyticsHost: host!, siteId: siteId! });
}

/** Tracks a pageview on every route change. Renders nothing. */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (isEnabled) {
      rybbit.pageview();
    }
  }, [location.pathname]);

  return null;
};

/**
 * Drop this inside <BrowserRouter> to enable automatic SPA pageview tracking.
 * No-op when BUN_PUBLIC_RYBBIT_HOST / BUN_PUBLIC_RYBBIT_SITE_ID are not set.
 */
export const AnalyticsProvider = () => {
  if (!isEnabled) {
    return null;
  }
  return <AnalyticsTracker />;
};
