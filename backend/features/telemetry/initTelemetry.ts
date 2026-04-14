import { metrics } from '@opentelemetry/api';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { otelConfig } from './otelConfig';

export const initTelemetry = (): void => {
  const endpoint = Bun.env.OTEL_ENDPOINT;
  if (!endpoint) {
    return;
  }

  const serviceName = Bun.env.OTEL_SERVICE_NAME ?? otelConfig.serviceName;

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
  // register() sets the global TracerProvider AND the default W3C propagator
  tracerProvider.register();

  // --- Metrics ---
  const meterProvider = new MeterProvider({
    resource,
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
        exportIntervalMillis: 30_000,
      }),
    ],
  });
  metrics.setGlobalMeterProvider(meterProvider);

  // Pre-build instruments — cheap to keep around.
  const meter = meterProvider.getMeter(serviceName);
  otelConfig.reqDuration = meter.createHistogram(
    'http.server.request.duration',
    {
      description: 'Duration of inbound HTTP requests in milliseconds.',
      unit: 'ms',
    },
  );
  otelConfig.reqCount = meter.createCounter('http.server.request.count', {
    description: 'Total number of inbound HTTP requests.',
  });

  // --- Logs ---
  const loggerProvider = new LoggerProvider({
    resource,
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({ url: `${endpoint}/v1/logs` }),
      ),
    ],
  });

  otelConfig.logger = loggerProvider.getLogger(serviceName);
  otelConfig.enabled = true;

  console.log(
    `🔭 OpenTelemetry enabled → ${endpoint} (service: ${serviceName})`,
  );
};
