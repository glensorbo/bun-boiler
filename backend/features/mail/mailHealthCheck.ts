import { mailConfig } from './mailConfig';

export const mailHealthCheck = async (): Promise<boolean> => {
  if (!mailConfig.transporter) {
    return false;
  }
  try {
    await Promise.race([
      mailConfig.transporter.verify(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000),
      ),
    ]);
    return true;
  } catch {
    return false;
  }
};
