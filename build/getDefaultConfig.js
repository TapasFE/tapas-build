'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDefaultConfig;

var _path = require('path');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _getEntry = require('./methods/getEntry');

var _getEntry2 = _interopRequireDefault(_getEntry);

var _getCommonLoaders = require('./methods/getCommonLoaders');

var _getCommonLoaders2 = _interopRequireDefault(_getCommonLoaders);

var _getCssLoaders = require('./methods/getCssLoaders');

var _getCssLoaders2 = _interopRequireDefault(_getCssLoaders);

var _getPlugins = require('./methods/getPlugins');

var _getPlugins2 = _interopRequireDefault(_getPlugins);

var _testExternal = require('./methods/testExternal');

var _testExternal2 = _interopRequireDefault(_testExternal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDefaultConfig(args) {

  var config = _extends({
    devtool: args.production ? false : 'cheap-module-eval-source-map',
    debug: Boolean(args.production),
    entry: (0, _getEntry2.default)(args),
    output: {
      path: args.output || (0, _path.join)(args.cwd, 'build'),
      filename: args.production && !args.isComponent ? '[name].[chunkhash:8].js' : '[name].js',
      publicPath: args.production ? args.publicPath : '/',
      library: '[name]',
      libraryTarget: 'umd',
      umdNamedDefines: true
    },
    module: {
      loaders: (0, _getCommonLoaders2.default)(args).concat((0, _getCssLoaders2.default)(args))
    },
    resolve: {
      fallback: (0, _path.join)(__dirname, '../node_modules'),
      extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
      //must set to resolve the loader from tapas-build, not process.cwd
      root: (0, _path.join)(__dirname, '../node_modules')
    },
    plugins: (0, _getPlugins2.default)(args),
    postcss: function postcss() {
      return {
        default: [require('autoprefixer')({ browsers: ['last 2 versions'] })]
      };
    }
  }, args.production && !args.isComponent ? { externals: _testExternal2.default } : {});

  // 组件在非生产环境下增加render方法
  if (args.isComponent && !args.production) {
    config.module.preLoaders = [{
      test: (0, _path.resolve)(args.entry),
      loader: 'render-placement',
      query: {
        replace: false,
        id: 'root'
      }
    }];
  }

  return config;
}