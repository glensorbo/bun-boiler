import { SeverityNumber } from '@opentelemetry/api-logs';

import { otelConfig } from './otelConfig';

import type { LogAttrs } from './types/LogAttrs';

export const emit = (
  severity: SeverityNumber,
  severityText: string,
  message: string,
  attrs?: LogAttrs,
): void => {
  if (!otelConfig.logger) {
    return;
  }
  otelConfig.logger.emit({
    severityNumber: severity,
    severityText,
    body: message,
    attributes: attrs,
  });
};
