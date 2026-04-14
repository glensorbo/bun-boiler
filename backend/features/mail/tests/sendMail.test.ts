import { describe, test, expect, afterEach } from 'bun:test';
import { mailConfig } from '../mailConfig';
import { sendMail } from '../sendMail';

const originalTransporter = mailConfig.transporter;

afterEach(() => {
  mailConfig.transporter = originalTransporter;
});

describe('sendMail', () => {
  test('returns immediately without throwing when transporter is null', async () => {
    mailConfig.transporter = null;
    await expect(
      sendMail({ to: 'test@example.com', subject: 'Hi', text: 'Hello' }),
    ).resolves.toBeUndefined();
  });

  test('throws when subject is missing', async () => {
    mailConfig.transporter = {
      sendMail: async () => ({ rejected: [] }),
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await expect(
      sendMail({ to: 'test@example.com', subject: '', text: 'Hello' }),
    ).rejects.toThrow('subject is required');
  });

  test('throws when both html and text are absent', async () => {
    mailConfig.transporter = {
      sendMail: async () => ({ rejected: [] }),
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await expect(
      sendMail({ to: 'test@example.com', subject: 'Hi' }),
    ).rejects.toThrow('at least one of html or text is required');
  });

  test('calls transporter.sendMail with html body', async () => {
    const calls: unknown[] = [];
    mailConfig.transporter = {
      sendMail: async (opts: unknown) => {
        calls.push(opts);
        return { rejected: [] };
      },
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await sendMail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    });

    expect(calls.length).toBe(1);
  });

  test('calls transporter.sendMail with text body', async () => {
    const calls: unknown[] = [];
    mailConfig.transporter = {
      sendMail: async (opts: unknown) => {
        calls.push(opts);
        return { rejected: [] };
      },
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await sendMail({ to: 'user@example.com', subject: 'Test', text: 'Hello' });

    expect(calls.length).toBe(1);
  });

  test('uses explicit from when provided', async () => {
    let sentFrom: string | undefined;
    mailConfig.transporter = {
      sendMail: async (opts: { from: string }) => {
        sentFrom = opts.from;
        return { rejected: [] };
      },
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await sendMail({
      to: 'user@example.com',
      subject: 'Test',
      text: 'Hi',
      from: 'custom@example.com',
    });

    expect(sentFrom).toBe('custom@example.com');
  });

  test('falls back to SMTP_FROM env var when from is not provided', async () => {
    const original = Bun.env.SMTP_FROM;
    Bun.env.SMTP_FROM = 'env@example.com';

    let sentFrom: string | undefined;
    mailConfig.transporter = {
      sendMail: async (opts: { from: string }) => {
        sentFrom = opts.from;
        return { rejected: [] };
      },
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await sendMail({ to: 'user@example.com', subject: 'Test', text: 'Hi' });
    expect(sentFrom).toBe('env@example.com');

    if (original !== undefined) {
      Bun.env.SMTP_FROM = original;
    } else {
      delete Bun.env.SMTP_FROM;
    }
  });

  test('falls back to no-reply@localhost when SMTP_FROM is unset', async () => {
    const original = Bun.env.SMTP_FROM;
    delete Bun.env.SMTP_FROM;

    let sentFrom: string | undefined;
    mailConfig.transporter = {
      sendMail: async (opts: { from: string }) => {
        sentFrom = opts.from;
        return { rejected: [] };
      },
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await sendMail({ to: 'user@example.com', subject: 'Test', text: 'Hi' });
    expect(sentFrom).toBe('no-reply@localhost');

    if (original !== undefined) {
      Bun.env.SMTP_FROM = original;
    }
  });

  test('does not throw when some recipients are rejected', async () => {
    mailConfig.transporter = {
      sendMail: async () => ({ rejected: ['bad@example.com'] }),
      verify: async () => true,
    } as unknown as typeof mailConfig.transporter;

    await expect(
      sendMail({ to: 'bad@example.com', subject: 'Test', text: 'Hi' }),
    ).resolves.toBeUndefined();
  });
});
