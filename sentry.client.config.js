import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Your Sentry DSN
  tracesSampleRate: 1.0, // Adjust sampling rate as needed
  // Add other Sentry options here (e.g., environment, release)
});