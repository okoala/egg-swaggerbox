'use strict';

const path = require('path');

module.exports = app => {
  let appRoot = app.config.swaggerbox.appRoot;
  if (!appRoot) appRoot = path.join(app.config.baseDir, 'app');
  if (!Array.isArray(appRoot)) appRoot = [ appRoot ];

  appRoot = appRoot.map(v => path.join(v, 'controller'));

  app.loader.loadController({
    directory: appRoot,
  });
};
