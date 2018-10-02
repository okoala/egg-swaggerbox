'use strict';

const staticCache = require('koa-static-cache');
const path = require('path');
const fs = require('fs');

module.exports = app => {
  app.use(staticCache(app.config.swaggerbox.ui));

  app.beforeStart(async () => {
    app.get('/swagger-doc', ctx => {
      ctx.response.status = 200;
      ctx.response.type = 'text/html';
      app.swagger.host = ctx.host;
      ctx.response.body = JSON.stringify(app.swagger);
    });
    app.logger.info('[egg-swaggerbox] ui register router: /swagger-doc');

    app.get('/swagger-ui.html', ctx => {
      let swaggerPath = path.join(__dirname, '/app/public/index.html');
      ctx.response.status = 200;
      ctx.response.type = 'text/html';
      ctx.response.body = fs.readFileSync(swaggerPath).toString();
    });
    app.logger.info('[egg-swaggerbox] ui register router: /swagger-ui.html');
  });
};
