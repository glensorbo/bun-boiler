import nodemailer from 'nodemailer';

import { logger } from '../telemetry/logger';
import { mailConfig } from './mailConfig';

export const initMailClient = (): void => {
  if (!mailConfig.host) {
    return;
  }

  mailConfig.transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    ...(mailConfig.user && mailConfig.pass
      ? { auth: { user: mailConfig.user, pass: mailConfig.pass } }
      : {}),
  });

  logger.info(`📧 Mail enabled → ${mailConfig.host}:${mailConfig.port}`);

  // Fix #2 — fire-and-forget verify to surface config errors early.
  // Intentionally not awaited: initMailClient() stays synchronous and the server
  // must start even when SMTP is misconfigured.
  mailConfig.transporter.verify().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('📧 Mail transporter failed verification — check SMTP config', {
      error: message,
    });
  });
};
