'use strict';

const swaggerLoader = require('./lib/swagger_loader');
const swaggerUI = require('../lib/swagger_ui');

module.exports = app => {
  app.swagger = swaggerLoader(app);

  if (app.config.swaggerbox.ui.enable) {
    swaggerUI(app);
  }
};
