import { SeverityNumber } from '@opentelemetry/api-logs';
import { emit } from './emit';
import type { LogAttrs } from './types/LogAttrs';

export const logger = {
  info: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.log(message, attrs);
    } else {
      console.log(message);
    }
    emit(SeverityNumber.INFO, 'INFO', message, attrs);
  },

  warn: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.warn(message, attrs);
    } else {
      console.warn(message);
    }
    emit(SeverityNumber.WARN, 'WARN', message, attrs);
  },

  error: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.error(message, attrs);
    } else {
      console.error(message);
    }
    emit(SeverityNumber.ERROR, 'ERROR', message, attrs);
  },

  debug: (message: string, attrs?: LogAttrs): void => {
    if (attrs) {
      console.debug(message, attrs);
    } else {
      console.debug(message);
    }
    emit(SeverityNumber.DEBUG, 'DEBUG', message, attrs);
  },
};
