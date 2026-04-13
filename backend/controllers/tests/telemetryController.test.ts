import { describe, test, expect, spyOn, afterEach } from 'bun:test';

const originalEndpoint = Bun.env.OTEL_ENDPOINT;

afterEach(() => {
  if (originalEndpoint !== undefined) {
    Bun.env.OTEL_ENDPOINT = originalEndpoint;
  } else {
    delete Bun.env.OTEL_ENDPOINT;
  }
});

import { telemetryController } from '@backend/controllers/telemetryController';

const makeRequest = (body = '{}') =>
  new Request('http://localhost/api/telemetry/traces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

describe('TelemetryController', () => {
  describe('proxyTraces', () => {
    test('returns 204 when OTEL_ENDPOINT is not set', async () => {
      delete Bun.env.OTEL_ENDPOINT;
      const response = await telemetryController.proxyTraces(makeRequest());
      expect(response.status).toBe(204);
    });

    test('returns null body when OTEL_ENDPOINT is not set', async () => {
      delete Bun.env.OTEL_ENDPOINT;
      const response = await telemetryController.proxyTraces(makeRequest());
      const text = await response.text();
      expect(text).toBe('');
    });

    test('forwards the collector status on success', async () => {
      Bun.env.OTEL_ENDPOINT = 'http://otel-collector:4318';
      const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(null, { status: 200 }),
      );

      const response = await telemetryController.proxyTraces(makeRequest());
      expect(response.status).toBe(200);
      fetchSpy.mockRestore();
    });

    test('sends the request body to the collector traces endpoint', async () => {
      Bun.env.OTEL_ENDPOINT = 'http://otel-collector:4318';
      const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(null, { status: 200 }),
      );

      await telemetryController.proxyTraces(makeRequest('{"spans":[]}'));
      const calledUrl = String((fetchSpy.mock.calls[0] as unknown[])[0]);
      expect(calledUrl).toBe('http://otel-collector:4318/v1/traces');
      fetchSpy.mockRestore();
    });

    test('returns 502 when the collector fetch throws', async () => {
      Bun.env.OTEL_ENDPOINT = 'http://otel-collector:4318';
      const fetchSpy = spyOn(globalThis, 'fetch').mockRejectedValueOnce(
        new Error('Connection refused'),
      );

      const response = await telemetryController.proxyTraces(makeRequest());
      expect(response.status).toBe(502);
      fetchSpy.mockRestore();
    });

    test('passes non-200 collector status back to the caller', async () => {
      Bun.env.OTEL_ENDPOINT = 'http://otel-collector:4318';
      const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(null, { status: 503 }),
      );

      const response = await telemetryController.proxyTraces(makeRequest());
      expect(response.status).toBe(503);
      fetchSpy.mockRestore();
    });
  });
});
