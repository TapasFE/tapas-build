'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _testExternal = require('./testExternal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (_ref) {
  var production = _ref.production;
  var index = _ref.index;
  var vendor = _ref.vendor;
  var isComponent = _ref.isComponent;
  var hash = _ref.hash;
  var extractCss = _ref.extractCss;

  // accept a boolean depending on env is production or not
  var env = production ? '"production"' : '"development"';

  var vendorJsName = hash ? '[name].[chunkhash:8].js' : '[name].js';
  var cssName = hash ? '[name].[chunkhash:8].css' : '[name].css';
  var plugins = [new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': env }), new _webpack2.default.optimize.OccurrenceOrderPlugin(), new _webpack2.default.NoErrorsPlugin()];
  if (vendor.length) {
    plugins = [].concat(_toConsumableArray(plugins), [new _webpack2.default.optimize.CommonsChunkPlugin({ name: 'vendor', filename: vendorJsName, minChunks: Infinity })]);
  }
  if (extractCss) {
    plugins = [].concat(_toConsumableArray(plugins), [new _extractTextWebpackPlugin2.default(cssName, { allChunks: true })]);
  }
  if (!isComponent || !production) {
    // 在组件打包生产代码时，不生成html
    plugins = [].concat(_toConsumableArray(plugins), [new _htmlWebpackPlugin2.default({ templateContent: index, inject: 'body' })]);
  }
  if (production) {
    if (!isComponent) {
      plugins = [].concat(_toConsumableArray(plugins), [new _webpack2.default.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: false
      })]);
    }
  } else {
    plugins = [].concat(_toConsumableArray(plugins), [new _webpack2.default.HotModuleReplacementPlugin()]);
  }
  return plugins;
};