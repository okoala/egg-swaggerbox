'use strict';

const controllerLoader = require('./lib/controller_loader');
const swaggerLoader = require('./lib/swagger_loader');
const swaggerUI = require('./lib/swagger_ui');
const SwaggerRouter = require('./lib/swagger_router');

module.exports = app => {
  app.swagger = swaggerLoader(app);

  if (app.config.swaggerbox.ui.enable) {
    swaggerUI(app);
  }

  app.beforeStart(async () => {
    if (app.config.swaggerbox.router.enable) {
      controllerLoader(app);

      const swaggerRouter = new SwaggerRouter(
        app,
        app.config.swaggerbox.router
      );

      await swaggerRouter.init();
      app.emit('swagger-router-initial-finished');
    }
  });
};
