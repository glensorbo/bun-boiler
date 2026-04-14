import { describe, test, expect, afterEach } from 'bun:test';

import { mailConfig } from '../mailConfig';

const originalHost = mailConfig.host;
const originalTransporter = mailConfig.transporter;

afterEach(() => {
  mailConfig.host = originalHost;
  mailConfig.transporter = originalTransporter;
});

describe('initMailClient', () => {
  test('is a no-op when SMTP_HOST is unset', async () => {
    mailConfig.host = undefined;
    mailConfig.transporter = null;
    const { initMailClient } = await import('../initMailClient');
    initMailClient();
    expect(mailConfig.transporter).toBeNull();
  });

  test('does not throw when SMTP_HOST is unset', async () => {
    mailConfig.host = undefined;
    mailConfig.transporter = null;
    const { initMailClient } = await import('../initMailClient');
    expect(() => initMailClient()).not.toThrow();
  });
});
