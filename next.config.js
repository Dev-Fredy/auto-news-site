// next.config.js
module.exports = {
  experimental: {
    clientTraceMetadata: false,
  },
  webpack(config) {
    config.resolve.alias['webworker-threads'] = require.resolve('./mocks/webworker-threads.js');
    return config;
  },
};