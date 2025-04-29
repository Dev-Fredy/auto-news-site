// app/api/sentry-example-api/route.ts
import { NextResponse } from 'next/server';

// If SentryExampleAPIError is a custom error class, ensure it's defined and imported
class SentryExampleAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}

// A faulty API route to test Sentry's error monitoring
export function GET() {
  throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
  return NextResponse.json({ data: "Testing Sentry Error..." });
}