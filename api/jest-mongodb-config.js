/* eslint-env node */

module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "6.0.0",
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },
  mongoURLEnvName: "MONGO_URL",
};
