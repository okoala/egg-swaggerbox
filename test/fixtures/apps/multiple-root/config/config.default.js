'use strict';

const path = require('path');

module.exports = app => {
  const exports = {};

  exports.keys = '123456';

  exports.swaggerbox = {
    appRoot: [ path.join(app.baseDir, 'app2'), path.join(app.baseDir, 'app') ],
  };

  return exports;
};
