import { describe, test, expect, afterEach } from 'bun:test';
import { otelConfig } from '../otelConfig';

const resetConfig = () => {
  otelConfig.enabled = false;
  otelConfig.logger = null;
  otelConfig.reqDuration = null;
  otelConfig.reqCount = null;
};

afterEach(() => {
  resetConfig();
  delete Bun.env.OTEL_ENDPOINT;
});

describe('initTelemetry', () => {
  test('is a no-op when OTEL_ENDPOINT is unset', async () => {
    delete Bun.env.OTEL_ENDPOINT;
    const { initTelemetry } = await import('../initTelemetry');
    initTelemetry();
    expect(otelConfig.enabled).toBe(false);
  });

  test('leaves logger null when OTEL_ENDPOINT is unset', async () => {
    delete Bun.env.OTEL_ENDPOINT;
    const { initTelemetry } = await import('../initTelemetry');
    initTelemetry();
    expect(otelConfig.logger).toBeNull();
  });

  test('leaves reqDuration null when OTEL_ENDPOINT is unset', async () => {
    delete Bun.env.OTEL_ENDPOINT;
    const { initTelemetry } = await import('../initTelemetry');
    initTelemetry();
    expect(otelConfig.reqDuration).toBeNull();
  });

  test('leaves reqCount null when OTEL_ENDPOINT is unset', async () => {
    delete Bun.env.OTEL_ENDPOINT;
    const { initTelemetry } = await import('../initTelemetry');
    initTelemetry();
    expect(otelConfig.reqCount).toBeNull();
  });
});
