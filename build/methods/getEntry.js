'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var production = _ref.production;
  var entry = _ref.entry;
  var vendor = _ref.vendor;

  // hmr enable via env
  !production && vendor.unshift('webpack-hot-middleware/client');

  if (vendor.length) {
    return {
      main: entry,
      vendor: vendor
    };
  } else {
    return {
      index: entry
    };
  }
};