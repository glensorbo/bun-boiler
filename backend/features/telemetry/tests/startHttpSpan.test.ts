import { describe, test, expect, afterEach } from 'bun:test';

import { otelConfig } from '../otelConfig';
import { startHttpSpan } from '../startHttpSpan';

const originalEnabled = otelConfig.enabled;

afterEach(() => {
  otelConfig.enabled = originalEnabled;
});

const makeGetHeader = (headers: Record<string, string>) => (name: string) =>
  headers[name.toLowerCase()] ?? null;

describe('startHttpSpan', () => {
  test('returns null when OTel is disabled', () => {
    otelConfig.enabled = false;
    const span = startHttpSpan(
      'GET',
      '/api/test',
      '/api/test',
      makeGetHeader({}),
    );
    expect(span).toBeNull();
  });

  test('returns a SpanHandle when OTel is enabled', () => {
    otelConfig.enabled = true;
    const span = startHttpSpan(
      'GET',
      '/api/test',
      '/api/test',
      makeGetHeader({}),
    );
    expect(span).not.toBeNull();
    expect(typeof span?.finish).toBe('function');
  });

  test('finish() does not throw for 2xx status', () => {
    otelConfig.enabled = true;
    const span = startHttpSpan(
      'GET',
      '/api/test',
      '/api/test',
      makeGetHeader({}),
    );
    expect(() => span?.finish(200)).not.toThrow();
  });

  test('finish() does not throw for 5xx status', () => {
    otelConfig.enabled = true;
    const span = startHttpSpan(
      'POST',
      '/api/test',
      '/api/test',
      makeGetHeader({}),
    );
    expect(() => span?.finish(500)).not.toThrow();
  });
});
