'use strict';

const path = require('path');
/**
 * egg-swaggerbox default config
 * @member Config#swaggerbox
 * @property {String} basePath - api prefix
 * @property {Object} apiInfo - swagger info
 * @property {Array[String]} schemes - access schema
 * @property {Array[String]} consumes - contentType
 * @property {Array[String]} produces - contentType
 * @property {Object} securityDefinitions - security definitions
 * @property {Boolean} enableSecurity - enable security
 * @property {Object} ui - swagger-ui server config
 */
exports.swaggerbox = {
  basePath: '/',
  apiInfo: {
    title: 'egg-swagger',
    description: 'swagger-ui for egg',
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    // apikey: {
    //   type: 'apiKey',
    //   name: 'clientkey',
    //   in: 'header',
    // },
    // oauth2: {
    //   type: 'oauth2',
    //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
    //   flow: 'password',
    //   scopes: {
    //     'write:access_token': 'write access_token',
    //     'read:access_token': 'read access_token',
    //   },
    // },
  },
  enableSecurity: false,
  router: {
    enable: true,
    validator: 'ajv',
  },
  ui: {
    enable: true,
    prefix: '/',
    dir: path.join(__dirname, '../app/public'),
    dynamic: true,
    preload: false,
    buffer: false,
    maxFiles: 1000,
  },
};
