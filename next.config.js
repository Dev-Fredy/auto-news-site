// next.config.js
module.exports = {
  webpack(config) {
    config.resolve.alias['webworker-threads'] = require.resolve('./mocks/webworker-threads.js');
    config.ignoreWarnings = [
      { module: /@opentelemetry\/instrumentation/ },
    ];
    return config;
  },
};