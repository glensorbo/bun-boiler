import { describe, test, expect, afterEach } from 'bun:test';
import { emit } from '../emit';
import { otelConfig } from '../otelConfig';

const originalLogger = otelConfig.logger;

afterEach(() => {
  otelConfig.logger = originalLogger;
});

describe('emit', () => {
  test('is a no-op when otelConfig.logger is null', () => {
    otelConfig.logger = null;
    expect(() => emit(9, 'INFO', 'hello')).not.toThrow();
  });

  test('calls otelConfig.logger.emit when logger is set', () => {
    const calls: unknown[] = [];
    otelConfig.logger = {
      emit: (record: unknown) => calls.push(record),
    } as unknown as typeof otelConfig.logger;

    emit(9, 'INFO', 'test message');
    expect(calls.length).toBe(1);
  });

  test('passes severityNumber, severityText, and body to logger.emit', () => {
    const calls: Array<{
      severityNumber: number;
      severityText: string;
      body: string;
    }> = [];
    otelConfig.logger = {
      emit: (record: (typeof calls)[0]) => calls.push(record),
    } as unknown as typeof otelConfig.logger;

    emit(9, 'INFO', 'my message');
    expect(calls[0]?.severityNumber).toBe(9);
    expect(calls[0]?.severityText).toBe('INFO');
    expect(calls[0]?.body).toBe('my message');
  });

  test('passes optional attrs to logger.emit', () => {
    const calls: Array<{ attributes?: unknown }> = [];
    otelConfig.logger = {
      emit: (record: (typeof calls)[0]) => calls.push(record),
    } as unknown as typeof otelConfig.logger;

    emit(9, 'INFO', 'message', { userId: '42' });
    expect(calls[0]?.attributes).toEqual({ userId: '42' });
  });
});
