import type { OtelConfig } from './types/OtelConfig';

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
