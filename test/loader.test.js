'use strict';

const mock = require('egg-mock');
const assert = require('assert');

describe('test/loader.test.js', () => {
  let app,
    ctx;
  before(() => {
    app = mock.app({
      baseDir: 'apps/loader',
    });
    return app.ready();
  });

  beforeEach(() => {
    ctx = app.createAnonymousContext();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /swagger-ui.html', () => {
    return app
      .httpRequest()
      .get('/swagger-ui.html')
      .expect(200);
  });

  it('should GET /swagger-doc', () => {
    return app
      .httpRequest()
      .get('/swagger-doc')
      .expect(200);
  });

  it('should app name work', () => {
    assert(ctx.app.config.swaggerbox.apiInfo.title === 'swagger-doc-test');
    assert(ctx.app.config.swaggerbox.apiInfo.description === 'this is a test');
  });
});
