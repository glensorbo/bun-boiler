# Telemetry

Optional OpenTelemetry (OTel) observability for the Bun backend.

When `OTEL_ENDPOINT` is **not** set, the module is a complete no-op — zero
overhead, no SDK started, no network connections.

When `OTEL_ENDPOINT` **is** set, the module exports:

- **Traces** — via `NodeTracerProvider` + `BatchSpanProcessor` + OTLP HTTP
- **Logs** — via `LoggerProvider` + `BatchLogRecordProcessor` + OTLP HTTP

---

## Quick Start

### With the local SigNoz stack (recommended for development)

A full SigNoz stack is included in the repo — ClickHouse, Zookeeper, the
SigNoz UI, and the OTel Collector. All data is persisted in named Docker
volumes so it survives restarts.

1. Start SigNoz:

   ```sh
   docker compose -f docker-compose.signoz.yml up -d
   ```

2. Wait ~30 s for ClickHouse to become healthy, then open
   [http://localhost:8080](http://localhost:8080).

3. Uncomment the OTel vars in your `.env`:

   ```
   OTEL_ENDPOINT=http://localhost:4318
   OTEL_SERVICE_NAME=bun-boiler
   ```

4. Start the dev server — you should see:

   ```
   🔭 OpenTelemetry enabled → http://localhost:4318 (service: bun-boiler)
   ```

5. To stop SigNoz (data is preserved in volumes):

   ```sh
   docker compose -f docker-compose.signoz.yml down
   ```

6. To stop **and** wipe all data:

   ```sh
   docker compose -f docker-compose.signoz.yml down -v
   ```

### With an external collector

1. Set `OTEL_ENDPOINT` in your `.env` pointing at any OTLP HTTP collector:

   ```
   OTEL_ENDPOINT=http://<your-collector>:4318
   OTEL_SERVICE_NAME=bun-boiler   # optional, defaults to "bun-boiler"
   ```

2. Start the server — you should see:

   ```
   🔭 OpenTelemetry enabled → http://<your-collector>:4318 (service: bun-boiler)
   ```

---

## Environment Variables

| Variable            | Required | Default      | Description                                                                      |
| ------------------- | -------- | ------------ | -------------------------------------------------------------------------------- |
| `OTEL_ENDPOINT`     | No       | —            | OTLP HTTP base URL (e.g. `http://localhost:4318`). OTel is disabled when absent. |
| `OTEL_SERVICE_NAME` | No       | `bun-boiler` | Service name reported in all signals.                                            |

---

## Signals

| Signal | Exporter                   | Endpoint path               |
| ------ | -------------------------- | --------------------------- |
| Traces | `OTLPTraceExporter` (HTTP) | `{OTEL_ENDPOINT}/v1/traces` |
| Logs   | `OTLPLogExporter` (HTTP)   | `{OTEL_ENDPOINT}/v1/logs`   |

Port **4318** (OTLP HTTP) is used — not 4317 (gRPC).

---

## Collector Examples

**SigNoz (self-hosted)**

```
OTEL_ENDPOINT=http://localhost:4318
```

**Jaeger (with OTLP receiver enabled)**

```
OTEL_ENDPOINT=http://localhost:4318
```

**OpenTelemetry Collector**

```
OTEL_ENDPOINT=http://otel-collector:4318
```

---

## Using the Logger

Import `logger` anywhere in the backend — it always writes to `console.*`
and, when OTel is enabled, also emits structured log records to the collector.

```ts
import { logger } from '@backend/telemetry';

// Plain message
logger.info('Server started');

// With structured attributes
logger.warn('Slow query', { durationMs: 1234, query: 'SELECT ...' });
logger.error('Unhandled error', { error: String(err) });
logger.debug('Cache hit', { key: 'user:42' });
```

### Methods

| Method                      | Console         | OTel Severity |
| --------------------------- | --------------- | ------------- |
| `logger.info(msg, attrs?)`  | `console.log`   | `INFO`        |
| `logger.warn(msg, attrs?)`  | `console.warn`  | `WARN`        |
| `logger.error(msg, attrs?)` | `console.error` | `ERROR`       |
| `logger.debug(msg, attrs?)` | `console.debug` | `DEBUG`       |

---

## Initialisation Order

`initTelemetry()` **must be called before any module that logs**, so it is
invoked at the very top of `backend/server.ts` before `validateEnv()` and
`pingDb()`.
