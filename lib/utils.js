'use strict';

const convert = require('koa-convert');
const _ = require('lodash');
const is = require('is-type-of');
const co = require('co');

/**
 * Convert path segment parameters from OpenAPI notation to koa-router notation.
 * @param  {string}  pathSegment like '{people}' (OpenAPI)
 * @return {string}  koa-router path segment like ':people'
 */
function openApiToKoa(pathSegment) {
  return pathSegment.replace(/^\{(.+)\}$/, ':$1');
}

/**
 * Converts URL paths from OpenAPI format to koa-router format.
 * @param  {string} path OpenAPI path like 'api/test/{id}'
 * @return {string}      koa-router path like 'api/test/:id'
 */
function routerFormat(path) {
  if (!path || typeof path !== 'string') return '';
  return _.map(path.split('/'), openApiToKoa).join('/');
}

function convertMiddleware(fn) {
  return is.generatorFunction(fn) ? convert(fn) : fn;
}

async function callFn(fn, args, ctx) {
  args = args || [];
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) fn = co.wrap(fn);
  return ctx ? fn.call(ctx, ...args) : fn(...args);
}

module.exports = { routerFormat, callFn, convertMiddleware };
