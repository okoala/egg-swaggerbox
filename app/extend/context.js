'use strict';

const swagger = Symbol('Context#swagger');

module.exports = {
  get swagger() {
    if (!this[swagger]) this[swagger] = this.app.swagger;
    return this[swagger];
  },
};
