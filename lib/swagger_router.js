'use strict';

const _ = require('lodash');
const swaggerParser = require('swagger-parser');
const pathMatching = require('egg-path-matching');

const debug = require('debug')('egg-swaggerbox:router');

const { routerFormat, convertMiddleware, callFn } = require('./utils');
const Parameters = require('./validator/parameters');
const Responses = require('./validator/responses');

module.exports = class SwaggerRouter {
  constructor(app, options) {
    this.app = app;
    this.apidoc = this.app.swagger;
    this.controller = this.app.controller;
    this.jsonSchemaFormatters = options.jsonSchemaFormatters;
    this.errorHandler = options.errorHandler;
    this.defaultResponseSchemas = options.defaultResponseSchemas;
    this.validator =
      options.validator === undefined ? 'ajv' : options.validator;

    if (this.validator !== 'ajv' && this.validator !== 'tv4') {
      this.validator = null;
    }

    if (options.ignore || options.match) {
      this.match = pathMatching({
        ignore: options.ignore,
        match: options.match,
      });
    }

    this.middlewares = [];

    this.router = this.app.router;

    this.swagger = null;
  }

  routes() {
    return this.router.routes();
  }

  registerMiddleware(name, fn) {
    if (typeof name !== 'string') throw new TypeError('name must be string.');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function.');

    this.middlewares.push({ name, fn });
  }

  async init() {
    const swagger = await swaggerParser.validate(this.apidoc, {
      validate: { schema: false, spec: false },
    });

    debug('swagger version', swagger.swagger);
    debug('info title', swagger.info.title);
    debug('info title', swagger.info.version);

    this.initRoute(swagger);
  }

  initRoute(swagger) {
    this.swagger = swagger;
    for (const endpoint in this.swagger.paths) {
      debug('route endpoint', endpoint);
      if (this.match && !this.match(endpoint)) continue;
      const endpointDetail = this.swagger.paths[endpoint];
      for (const method in endpointDetail) {
        this.registerRoute(method, endpoint, endpointDetail[method]);
      }
    }
  }

  registerRoute(method, endpoint, detail) {
    const apiPath = routerFormat(endpoint);
    debug(`mount ${method} ${apiPath}`);

    const respValidator = new Responses(
      detail,
      this.validator,
      this.errorHandler,
      this.defaultResponseSchemas
    );

    const paramValidator = new Parameters(
      detail,
      this.validator,
      this.jsonSchemaFormatters
    );

    const handlers = detail['x-controller'];

    let middlewares = this.loadMiddlewares(detail);
    middlewares.push(respValidator);
    middlewares.push(paramValidator);
    middlewares.push(handlers);

    const controller = !_.isEmpty(this.app.controller)
      ? this.app.controller
      : this.controller;

    debug('middlewares', middlewares);
    debug('controller', controller);

    if (!handlers) {
      return;
    }

    middlewares = convertMiddlewares(middlewares, controller);

    this.router[method](apiPath, ...middlewares);
  }

  loadMiddlewares(detail) {
    const middlewares = [];

    for (const middleware of this.middlewares) {
      const middlewareOptions = detail[middleware.name];
      if (_.startsWith(middleware.name, 'x-middleware')) {
        debug(
          `use middleware ${middleware.name} ${JSON.stringify(
            middlewareOptions
          )}`
        );
        middlewares.push(middleware.fn(middlewareOptions));
      }
    }

    return middlewares;
  }
};

/**
 * resolve controller from string to function
 * @param  {String|Function} controller input controller
 * @param  {Application} appController egg application instance
 * @return {Function} controller function
 */
function resolveController(controller, appController) {
  debug('resolve controller', controller);

  if (_.isString(controller)) {
    const actions = controller.split('.');
    let obj = appController;
    actions.forEach(key => {
      obj = obj[key];
      if (!obj) throw new Error(`controller '${controller}' not exists`);
    });
    controller = obj;
  }
  // ensure controller is exists
  if (!controller) throw new Error('controller not exists');
  return controller;
}

/**
 * 1. ensure controller(last argument) support string
 * - [url, controller]: app.get('/home', 'home');
 * - [name, url, controller(string)]: app.get('posts', '/posts', 'posts.list');
 * - [name, url, controller]: app.get('posts', '/posts', app.controller.posts.list);
 * - [name, url(regexp), controller]: app.get('regRouter', /\/home\/index/, 'home.index');
 * - [name, url, middleware, [...], controller]: `app.get(/user/:id', hasLogin, canGetUser, 'user.show');`
 *
 * 2. make middleware support generator function
 *
 * @param  {Array} middlewares middlewares and controller(last middleware)
 * @param  {Application} appController  egg application ctrl instance
 * @return {Array} middlewares
 */
function convertMiddlewares(middlewares, appController) {
  // ensure controller is resolved
  const controller = resolveController(middlewares.pop(), appController);
  // make middleware support generator function
  middlewares = middlewares.map(convertMiddleware);
  const wrappedController = (ctx, next) => {
    return callFn(controller, [ ctx, next ], ctx);
  };
  return middlewares.concat([ wrappedController ]);
}
