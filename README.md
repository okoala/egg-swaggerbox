# egg-swaggerbox

swagger useful module for egg.

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
