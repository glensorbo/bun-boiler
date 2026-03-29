import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import type {
  AnyValueMap,
  Logger as OtelLogger,
} from '@opentelemetry/api-logs';

type LogAttrs = AnyValueMap;

// Set by initTelemetry() when OTEL_ENDPOINT is configured; null otherwise.
let otelLogger: OtelLogger | null = null;

export const initTelemetry = (): void => {
  const endpoint = Bun.env.OTEL_ENDPOINT;
  if (!endpoint) {
    return;
  }

  const serviceName = Bun.env.OTEL_SERVICE_NAME ?? 'bun-boiler';

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
  });

  // --- Traces ---
  const tracerProvider = new NodeTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
      ),
    ],
  });
  tracerProvider.register();

  // --- Logs ---
  const loggerProvider = new LoggerProvider({
    resource,
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({ url: `${endpoint}/v1/logs` }),
      ),
    ],
  });

  otelLogger = loggerProvider.getLogger(serviceName);

  console.log(
    `🔭 OpenTelemetry enabled → ${endpoint} (service: ${serviceName})`,
  );
};

const emit = (
  severity: SeverityNumber,
  severityText: string,
  message: string,
  attrs?: LogAttrs,
): void => {
  if (!otelLogger) {
    return;
  }
  otelLogger.emit({
    severityNumber: severity,
    severityText,
    body: message,
    attributes: attrs,
  });
};

export const logger = {
  info: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.log(message, attrs);
    } else {
      console.log(message);
    }
    emit(SeverityNumber.INFO, 'INFO', message, attrs);
  },

  warn: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.warn(message, attrs);
    } else {
      console.warn(message);
    }
    emit(SeverityNumber.WARN, 'WARN', message, attrs);
  },

  error: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.error(message, attrs);
    } else {
      console.error(message);
    }
    emit(SeverityNumber.ERROR, 'ERROR', message, attrs);
  },

  debug: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.debug(message, attrs);
    } else {
      console.debug(message);
    }
    emit(SeverityNumber.DEBUG, 'DEBUG', message, attrs);
  },
};
