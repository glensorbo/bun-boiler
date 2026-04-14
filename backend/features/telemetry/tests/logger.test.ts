import { describe, test, expect, spyOn, afterEach } from 'bun:test';
import { logger } from '../logger';
import { otelConfig } from '../otelConfig';

const originalLogger = otelConfig.logger;

afterEach(() => {
  otelConfig.logger = originalLogger;
});

describe('logger', () => {
  describe('logger.info', () => {
    test('calls console.log', () => {
      const spy = spyOn(console, 'log').mockImplementation(() => {});
      logger.info('info message');
      expect(spy).toHaveBeenCalledWith('info message');
      spy.mockRestore();
    });

    test('calls console.log with attrs', () => {
      const spy = spyOn(console, 'log').mockImplementation(() => {});
      logger.info('info message', { key: 'val' });
      expect(spy).toHaveBeenCalledWith('info message', { key: 'val' });
      spy.mockRestore();
    });
  });

  describe('logger.warn', () => {
    test('calls console.warn', () => {
      const spy = spyOn(console, 'warn').mockImplementation(() => {});
      logger.warn('warn message');
      expect(spy).toHaveBeenCalledWith('warn message');
      spy.mockRestore();
    });
  });

  describe('logger.error', () => {
    test('calls console.error', () => {
      const spy = spyOn(console, 'error').mockImplementation(() => {});
      logger.error('error message');
      expect(spy).toHaveBeenCalledWith('error message');
      spy.mockRestore();
    });
  });

  describe('logger.debug', () => {
    test('calls console.debug', () => {
      const spy = spyOn(console, 'debug').mockImplementation(() => {});
      logger.debug('debug message');
      expect(spy).toHaveBeenCalledWith('debug message');
      spy.mockRestore();
    });
  });

  describe('OTel forwarding', () => {
    test('calls otelConfig.logger.emit when logger is set', () => {
      const calls: unknown[] = [];
      otelConfig.logger = {
        emit: (record: unknown) => calls.push(record),
      } as unknown as typeof otelConfig.logger;

      const spy = spyOn(console, 'log').mockImplementation(() => {});
      logger.info('forwarded message');
      spy.mockRestore();

      expect(calls.length).toBe(1);
    });

    test('does not throw when otelConfig.logger is null', () => {
      otelConfig.logger = null;
      const spy = spyOn(console, 'log').mockImplementation(() => {});
      expect(() => logger.info('safe message')).not.toThrow();
      spy.mockRestore();
    });
  });
});
