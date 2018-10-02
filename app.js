'use strict';

const swaggerLoader = require('./lib/swagger_loader');
const swaggerUI = require('./lib/swagger_ui');
const SwaggerRouter = require('./lib/swagger_router');

module.exports = class {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    const { app } = this;
    app.swagger = swaggerLoader(app);

    if (app.config.swaggerbox.ui.enable) {
      swaggerUI(app);
    }

    if (app.config.swaggerbox.router.enable) {
      const swaggerRouter = new SwaggerRouter(
        app,
        app.config.swaggerbox.router
      );

      await swaggerRouter.init();
    }
  }
};
