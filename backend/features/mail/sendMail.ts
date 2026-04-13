import { mailConfig } from './mailConfig';
import { logger } from '@backend/features/telemetry';

import type { MailOptions } from './types/MainOptions';

export const sendMail = async (options: MailOptions): Promise<void> => {
  if (!mailConfig.transporter) {
    return;
  }

  // Fix #4 — runtime guard: subject must be a non-empty string.
  if (!options.subject) {
    throw new Error('sendMail: subject is required');
  }

  // Fix #5 — runtime guard: at least one body field must be present.
  if (!options.html && !options.text) {
    throw new Error('sendMail: at least one of html or text is required');
  }

  const from = options.from ?? Bun.env.SMTP_FROM ?? 'no-reply@localhost';

  const info = await mailConfig.transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (info.rejected.length > 0) {
    logger.warn(
      '📧 sendMail: some recipients were rejected by the SMTP server',
      { rejected: info.rejected.map(String) },
    );
  }
};
