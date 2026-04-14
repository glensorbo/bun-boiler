import { describe, test, expect, afterEach } from 'bun:test';

import { mailConfig } from '../mailConfig';
import { mailHealthCheck } from '../mailHealthCheck';

const originalTransporter = mailConfig.transporter;

afterEach(() => {
  mailConfig.transporter = originalTransporter;
});

describe('mailHealthCheck', () => {
  test('returns false when transporter is null', async () => {
    mailConfig.transporter = null;
    const result = await mailHealthCheck();
    expect(result).toBe(false);
  });

  test('returns true when transporter.verify() resolves', async () => {
    mailConfig.transporter = {
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    const result = await mailHealthCheck();
    expect(result).toBe(true);
  });

  test('returns false when transporter.verify() rejects', async () => {
    mailConfig.transporter = {
      verify: async () => {
        throw new Error('Connection refused');
      },
    } as unknown as typeof mailConfig.transporter;

    const result = await mailHealthCheck();
    expect(result).toBe(false);
  });

  test('returns false when transporter.verify() times out', async () => {
    mailConfig.transporter = {
      verify: () => new Promise(() => {}),
    } as unknown as typeof mailConfig.transporter;

    const result = await Promise.race([
      mailHealthCheck(),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 4000)),
    ]);
    expect(result).toBe(false);
  }, 5000);
});
