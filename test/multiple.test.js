'use strict';

const mock = require('egg-mock');

describe('test/multiple.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/multiple-root',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /resource', () => {
    return app
      .httpRequest()
      .get('/resource')
      .expect(200);
  });

  it('should GET /api/children', () => {
    return app
      .httpRequest()
      .get('/api/children')
      .expect(200);
  });
});
