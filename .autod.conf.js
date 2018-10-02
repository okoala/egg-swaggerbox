"use strict";

module.exports = {
  write: true,
  prefix: "^",
  plugin: "autod-egg",
  exclude: ["test/fixtures", "examples", "docs", "run", "app/public"],
  devdep: [
    "autod",
    "autod-egg",
    "egg-ci",
    "egg-bin",
    "eslint",
    "eslint-config-egg",
    "webstorm-disable-index"
  ]
};
