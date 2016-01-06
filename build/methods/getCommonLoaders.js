'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getBabelrc = require('./getBabelrc');

var _getBabelrc2 = _interopRequireDefault(_getBabelrc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var production = _ref.production;
  var hash = _ref.hash;
  var entry = _ref.entry;
  var babelLoaderPlugins = _ref.babelLoaderPlugins;

  var name = hash ? '[name].[hash:8].[ext]' : '[name].[ext]';
  var babelQuery = {
    presets: _getBabelrc2.default.presets,
    plugins: production ? _getBabelrc2.default.plugins : _getBabelrc2.default.devPlugins
  };
  // 合并babelLoaderPlugins
  Array.prototype.push.apply(babelQuery.plugins, babelLoaderPlugins);
  var loaders = [{
    test: /\.jsx?$/,
    loader: 'babel',
    query: babelQuery,
    exclude: /node_modules/
  }, {
    test: /\.json$/,
    loader: 'json'
  }, {
    test: /\.(png|jpg|gif)$/,
    loader: 'url',
    query: {
      limit: 2048,
      name: 'images/' + name
    }
  }, {
    test: /\.woff$/,
    loader: 'url',
    query: {
      limit: 100,
      mimetype: 'application/font-woff',
      name: 'fonts/' + name
    }
  }, {
    test: /\.woff2$/,
    loader: 'url',
    query: {
      limit: 100,
      mimetype: 'application/font-woff2',
      name: 'fonts/' + name
    }
  }, {
    test: /\.ttf$/,
    loader: 'url',
    query: {
      limit: 100,
      mimetype: 'application/octet-stream',
      name: 'fonts/' + name
    }
  }, {
    test: /\.eot$/,
    loader: 'url',
    query: {
      limit: 100,
      name: 'fonts/' + name
    }
  }, {
    test: /\.svg$/,
    loader: 'url',
    query: {
      limit: 10000,
      mimetype: 'image/svg+xml',
      name: 'fonts/' + name
    }
  }];
  return loaders;
};