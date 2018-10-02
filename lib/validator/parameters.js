'use strict';

const _ = require('lodash');
const debug = require('debug')('egg-swaggerbox:validate:parameters');
const validate = require('./json-schema');

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types
 */
module.exports = class Parameters {
  constructor(schema, validator, formater) {
    this.schema = schema;
    this.schema.parameters = this.schema.parameters || [];
    this.formater = formater;
    this.validator = validator;

    if (!this.validator) {
      return async (ctx, next) => {
        return await next();
      };
    }

    debug('swagger schema parameters:', this.schema.parameters);

    return async (ctx, next) => {
      debug(ctx.query, ctx.request.body, ctx.params);

      this.validate(ctx, 'header', ctx.headers);
      this.validate(ctx, 'path', ctx.params);
      this.validate(ctx, 'query', ctx.query);
      this.validate(ctx, 'formData', ctx.query);
      this.validate(ctx, 'body', ctx.request.body);

      return await next();
    };
  }

  /**
   * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject
   * Path - Used together with Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
   * Query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
   * Header - Custom headers that are expected as part of the request.
   * Body - The payload that's appended to the HTTP request. Since there can only be one payload, there can only be one body parameter. The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation.
   * Form - Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
   *        application/x-www-form-urlencoded - Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger - both foo and bar are form parameters. This is normally used for simple parameters that are being transferred
   *        multipart/form-data - each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers.
   *
   * @param object ctx
   * @param type   query,path,header,body,form
   * @param data   data to validate
   */
  validate(ctx, type = 'query', originData = {}) {
    const jsonSchema = this.fetchAsSchema(type, this.schema.parameters);

    if (!jsonSchema) return;

    // Inject default required filed.
    // I use json-schema to validate parameters, but json-schema says:
    //        http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.15
    //        The value of this keyword MUST be an array. This array MUST have at least one element. Elements of this array MUST be strings, and MUST be unique.
    //        An object instance is valid against this keyword if its property set contains all elements in this keyword's array value.
    // But OAI not validate query parameters through json-schema. Query could has no parameter, https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
    // So i should inject a default required key for query if it's schema has no required field.
    const defaultKey = 'default:required:just4validatequery';
    if (
      type === 'query' &&
      jsonSchema.required &&
      jsonSchema.required.length === 0
    ) {
      jsonSchema.required.push(defaultKey);
      jsonSchema.properties[defaultKey] = { type: 'string' };
      originData[defaultKey] = defaultKey;
    }

    const { valid, message, path, error, data } = validate(
      originData,
      jsonSchema,
      this.formater,
      this.validator
    );
    delete originData[defaultKey];

    debug(
      `validate [${type}] [${valid}] [${this.validator}]`,
      jsonSchema,
      data,
      error
    );

    if (valid) return;

    ctx.throw(400, {
      type,
      path,
      error: message,
      data,
      detail: error,
    });
  }

  /**
   * fetch the endpoint's parameters as json-schema.
   * @param  string type        parameter type, support[query, path, body].
   * @param  array  parameters  swagger api doc parameters.
   * @return null,object        json-schema object
   */
  fetchAsSchema(type, parameters) {
    let schema = null;

    if (type.toLowerCase() === 'body') {
      schema = _.find(parameters, item => {
        return item.in.toLowerCase() === 'body';
      });
      schema = schema ? schema.schema : null;
    } else if (
      type.toLowerCase() === 'query' ||
      type.toLowerCase() === 'path'
    ) {
      schema = this.fetchMulti(type, parameters);
    } else if (type.toLowerCase() === 'header') {
      schema = this.fetchMulti(type, parameters);
    }

    return schema;
  }

  /**
   * fetch multi parameters in query,path as a json-schema object.
   * @param  string type        parameter type, support[query, path, body].
   * @param  array  parameters  swagger api doc parameters.
   * @return object  json-schema object
   */
  fetchMulti(type, parameters) {
    const multiSchema = {
      required: [],
      properties: {},
    };

    _.each(parameters, field => {
      if (field.in.toLowerCase() !== type) return;
      if (field.required) multiSchema.required.push(field.name);

      multiSchema.properties[field.name] = _.omit(field, [
        'name',
        'in',
        'description',
        'required',
      ]);
    });

    return _.isEmpty(multiSchema.properties) ? null : multiSchema;
  }
};
