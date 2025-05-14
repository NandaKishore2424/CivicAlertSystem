module.exports = function override(config, env) {
  if (env === 'development') {
    config.devServer = {
      ...config.devServer,
      setupMiddlewares: (middlewares, devServer) => {
        if (config.devServer.onBeforeSetupMiddleware) {
          config.devServer.onBeforeSetupMiddleware(devServer);
        }
        if (config.devServer.onAfterSetupMiddleware) {
          config.devServer.onAfterSetupMiddleware(devServer);
        }
        return middlewares;
      }
    };
  }
  return config;
};