import { OpenPanel } from '@openpanel/web';

import { config } from '@frontend/config';

const { clientId, apiUrl } = config.openpanel;
const isEnabled = Boolean(clientId);

export const op = isEnabled
  ? new OpenPanel({
      clientId: clientId!,
      ...(apiUrl && { apiUrl }),
      trackScreenViews: true,
      trackOutgoingLinks: true,
      trackAttributes: true,
      sessionReplay: {
        enabled: true,
        maskAllInputs: true,
      },
    })
  : null;

if (isEnabled) {
  console.log('📊 OpenPanel analytics enabled (session replay: on)');
} else {
  console.log(
    '📊 OpenPanel analytics disabled (BUN_PUBLIC_OPENPANEL_CLIENT_ID not set)',
  );
}

/**
 * Drop this inside the app root to enable automatic SPA pageview tracking
 * and session replay. No-op when BUN_PUBLIC_OPENPANEL_CLIENT_ID is not set.
 */
export const AnalyticsProvider = () => null;
