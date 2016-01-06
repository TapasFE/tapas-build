'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getWebpackConfig;

var _getDefaultConfig = require('./getDefaultConfig');

var _getDefaultConfig2 = _interopRequireDefault(_getDefaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackConfig(args) {

  var config = (0, _getDefaultConfig2.default)(args);

  return config;
}