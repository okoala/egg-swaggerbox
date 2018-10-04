'use strict';

const mock = require('egg-mock');

describe('test/router.router.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/router',
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
});
