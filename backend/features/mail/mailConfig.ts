import type { MailConfig } from './types/MailConfig';

export const mailConfig: MailConfig = {
  transporter: null,
  host: Bun.env.SMTP_HOST,
  port: Number(Bun.env.SMTP_PORT ?? 587),
  secure: Bun.env.SMTP_SECURE === 'true',
  user: Bun.env.SMTP_USER,
  pass: Bun.env.SMTP_PASS,
};
