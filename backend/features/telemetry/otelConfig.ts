import type { Counter, Histogram } from '@opentelemetry/api';
import type { Logger as OtelLogger } from '@opentelemetry/api-logs';

type OtelConfig = {
  serviceName: string;
  enabled: boolean;
  logger: OtelLogger | null;
  reqDuration: Histogram | null;
  reqCount: Counter | null;
};

/** Internal state — set by initTelemetry() **/
export const otelConfig: OtelConfig = {
  serviceName: 'bun-boiler',
  enabled: false,
  /** OTel logger for structured log shipping. */
  logger: null,
  /** HTTP request duration histogram (ms). Null when OTel is disabled. */
  reqDuration: null,
  /** HTTP request count counter. Null when OTel is disabled. */
  reqCount: null,
};
