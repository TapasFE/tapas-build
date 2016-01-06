'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _cdnInfo = require('tapas-externals/cdnInfo');

var _cdnInfo2 = _interopRequireDefault(_cdnInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function (context, request, callback) {
  var cdn = _cdnInfo2.default[request];
  if (cdn) {
    return callback(null, request, 'umd');
  }
  callback();
}).bind(undefined);