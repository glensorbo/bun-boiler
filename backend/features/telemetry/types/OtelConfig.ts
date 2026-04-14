import type { Counter, Histogram } from '@opentelemetry/api';
import type { Logger as OtelLogger } from '@opentelemetry/api-logs';

export type OtelConfig = {
  serviceName: string;
  enabled: boolean;
  logger: OtelLogger | null;
  reqDuration: Histogram | null;
  reqCount: Counter | null;
};
