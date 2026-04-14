import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export type MailConfig = {
  transporter: Transporter<SMTPTransport.SentMessageInfo> | null;
  port: number;
  host: string | undefined;
  secure: boolean;
  user: string | undefined;
  pass: string | undefined;
};
