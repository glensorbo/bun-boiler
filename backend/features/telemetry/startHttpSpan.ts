import {
  context,
  propagation,
  SpanStatusCode,
  trace,
} from '@opentelemetry/api';
import {
  ATTR_HTTP_REQUEST_METHOD,
  ATTR_HTTP_RESPONSE_STATUS_CODE,
  ATTR_HTTP_ROUTE,
  ATTR_URL_PATH,
} from '@opentelemetry/semantic-conventions';
import { otelConfig } from './otelConfig';
import type { SpanHandle } from './types/SpanHandle';
/**
 * Starts an HTTP server span for an inbound request.
 *
 * - Extracts the incoming W3C `traceparent` / `tracestate` headers so the
 *   span is automatically parented to any upstream trace (e.g. a browser
 *   span sent by the frontend).
 * - Returns a {@link SpanHandle} whose `finish()` sets the HTTP status code,
 *   marks errors, records metrics, and ends the span.
 * - Returns `null` when OTel is disabled so callers skip everything cheaply.
 *
 * @param method  HTTP method (upper-case, e.g. "GET")
 * @param route   Route template (e.g. "/api/user/:id")
 * @param path    Actual URL path (e.g. "/api/user/42")
 * @param getHeader  Header accessor from the incoming Request
 */
export const startHttpSpan = (
  method: string,
  route: string,
  path: string,
  getHeader: (name: string) => string | null,
): SpanHandle | null => {
  if (!otelConfig.enabled) {
    return null;
  }

  // Extract parent context from W3C traceparent / tracestate headers.
  const carrier: Record<string, string> = {};
  const traceparent = getHeader('traceparent');
  const tracestate = getHeader('tracestate');
  if (traceparent) {
    carrier['traceparent'] = traceparent;
  }
  if (tracestate) {
    carrier['tracestate'] = tracestate;
  }

  const parentCtx = propagation.extract(context.active(), carrier);

  const spanName = `${method} ${route}`;
  const tracer = trace.getTracer(otelConfig.serviceName);

  const span = tracer.startSpan(
    spanName,
    {
      attributes: {
        [ATTR_HTTP_REQUEST_METHOD]: method,
        [ATTR_HTTP_ROUTE]: route,
        [ATTR_URL_PATH]: path,
      },
    },
    parentCtx,
  );

  const startMs = performance.now();

  return {
    finish: (statusCode: number): void => {
      const durationMs = performance.now() - startMs;

      span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, statusCode);

      if (statusCode >= 500) {
        span.setStatus({ code: SpanStatusCode.ERROR });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      span.end();

      // Record metrics with low-cardinality labels.
      const labels = {
        [ATTR_HTTP_REQUEST_METHOD]: method,
        [ATTR_HTTP_ROUTE]: route,
        [ATTR_HTTP_RESPONSE_STATUS_CODE]: statusCode,
      };
      otelConfig.reqDuration?.record(durationMs, labels);
      otelConfig.reqCount?.add(1, labels);
    },
  };
};
