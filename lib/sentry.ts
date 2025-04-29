import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn('SENTRY_DSN is not defined. Sentry will not be initialized.');
    return;
  }
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}

export function captureException(error: any) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error);
  } else {
    console.error('Sentry not initialized:', error);
  }
}