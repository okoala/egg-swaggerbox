'use strict';

const _ = require('lodash');
const debug = require('debug')('egg-swaggerbox:validate:response');
const { paramErrorSchema, defaultErrorSchema } = require('./schema-default');

module.exports = class Responses {
  constructor(schema, validator, errorHandler, defaultResponseSchemas) {
    this.schema = schema;
    this.schema.responses = this.schema.responses || {};
    this.errorHandler = errorHandler || this.defaultErrorHandler;
    this.defaultResponseSchemas = defaultResponseSchemas || {};

    debug('swagger schema responses:', this.schema.responses);

    return async (ctx, next) => {
      debug(ctx.query, ctx.request.body, ctx.params);

      try {
        return await next();
      } catch (error) {
        error.status = error.status || 500;

        ctx.status = error.status;
        ctx.body = this.errorHandler(error, ctx, this.schema);

        // since we handled this manually we'll want to delegate to the regular app
        // level error handling as well so that centralized still functions correctly.
        ctx.app.emit('error', error, ctx, this.schema);
      }
    };
  }

  defaultErrorHandler(error, ctx, schema) {
    const status = error.status;
    let respSchema = null;

    if (status === 400) {
      respSchema =
        schema.responses[String(status)] ||
        this.defaultResponseSchemas[String(status)] ||
        paramErrorSchema;
    } else {
      respSchema =
        schema.responses[String(status)] ||
        this.defaultResponseSchemas[String(status)] ||
        schema.responses.default ||
        defaultErrorSchema;
    }

    if (respSchema.schema) {
      debug('error', error);
      debug('error status', error.status);
      debug(
        'using response schema:',
        respSchema,
        _.keys(respSchema.schema.properties)
      );

      const data = _.pick(error, _.keys(respSchema.schema.properties));
      debug('error result', data);

      return data;
    }

    return error;
  }
};
