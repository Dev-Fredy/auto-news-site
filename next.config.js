const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration
  reactStrictMode: true,
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry options
    silent: true, // Suppresses Sentry logs during build
  }
);