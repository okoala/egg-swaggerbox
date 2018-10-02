'use strict';

const tv4 = require('tv4-x');
const { RANGES } = require('./constants');

tv4.addFormat('int32', (data, schema) => {
  data = Number(data);
  if (data <= RANGES.int32.max && data >= RANGES.int32.min) return null;
  return `int32 range[${RANGES.int32.min}~${RANGES.int32.max}]`;
});

tv4.addFormat('int64', (data, schema) => {
  data = Number(data);
  if (data <= RANGES.int64.max && data >= RANGES.int64.min) return null;
  return `int64 range[${RANGES.int64.min}~${RANGES.int64.max}]`;
});

tv4.addFormat('float', (data, schema) => {
  data = Number(data);
  if (data <= RANGES.float.max && data >= RANGES.float.min) return null;
  return `float range[${RANGES.float.min}~${RANGES.float.max}]`;
});

tv4.addFormat('double', (data, schema) => {
  data = Number(data);
  if (data <= RANGES.double.max && data >= RANGES.double.min) return null;
  return `double range[${RANGES.double.min}~${RANGES.double.max}]`;
});

function addCustomFormat(customFormatters) {
  for (const key in customFormatters) {
    tv4.addFormat(key, customFormatters[key]);
  }
}

/**
 * [validate description]
 * @param  {[type]} data             [description]
 * @param  {[type]} schema           [description]
 * @param  {[type]} customFormatters [description]
 * @return object                  [description]
 *           valid   boolean
 *           message string   validate error message.
 *           path    string   validate error json path.
 *           error   mixed    raw error get from validate engine.
 *           data    object   some engine can't coerce the data, like ajv.
 */
module.exports = function validate(data, schema, customFormatters) {
  addCustomFormat(customFormatters);

  const ret = tv4.validateResult(data, schema, true, false, true);

  return {
    valid: ret.valid,
    message: ret.error ? ret.error.message : '',
    path: ret.error ? ret.error.dataPath : '',
    error: ret.error,
    data,
  };
};
