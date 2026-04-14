import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type MailConfig = {
  transporter: Transporter<SMTPTransport.SentMessageInfo> | null;
  port: number;
  host: string | undefined;
  secure: boolean;
  user: string | undefined;
  pass: string | undefined;
};

export const mailConfig: MailConfig = {
  transporter: null,
  host: Bun.env.SMTP_HOST,
  port: Number(Bun.env.SMTP_PORT ?? 587),
  secure: Bun.env.SMTP_SECURE === 'true',
  user: Bun.env.SMTP_USER,
  pass: Bun.env.SMTP_PASS,
};
