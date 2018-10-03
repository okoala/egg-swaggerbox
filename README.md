# egg-swaggerbox

swagger useful module for egg.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-swaggerbox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-swaggerbox
[travis-image]: https://img.shields.io/travis/okoala/egg-swaggerbox.svg?style=flat-square
[travis-url]: https://travis-ci.org/okoala/egg-swaggerbox
[codecov-image]: https://img.shields.io/codecov/c/github/okoala/egg-swaggerbox.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/okoala/egg-swaggerbox
[david-image]: https://img.shields.io/david/okoala/egg-swaggerbox.svg?style=flat-square
[david-url]: https://david-dm.org/okoala/egg-swaggerbox
[snyk-image]: https://snyk.io/test/npm/egg-swaggerbox/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-swaggerbox
[download-image]: https://img.shields.io/npm/dm/egg-swaggerbox.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-swaggerbox

## Install

```bash
$ npm i egg-swaggerbox --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.swaggerdoc = {
  enable: true,
  package: "egg-swaggerbox"
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.swaggerbox = {
  apiInfo: {
    title: "egg-swagger",
    description: "swagger-ui for egg",
    version: "1.0.0"
  },
  ui: {
    prefix: "/",
    dir: path.join(__dirname, "../app/public"),
    dynamic: true,
    preload: false,
    buffer: false,
    maxFiles: 1000
  }
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/okoala/egg-swaggerbox/issues).

## License

[MIT](LICENSE)
