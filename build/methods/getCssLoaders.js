'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var extractCss = _ref.extractCss;
  var cssModules = _ref.cssModules;

  // accept a boolean to decide css modules or not
  var cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
  var cssLoaderGlobal = 'css';
  var lessLoader = 'css!less';
  if (extractCss) {
    cssLoaderLocal = _extractTextWebpackPlugin2.default.extract('style', cssLoaderLocal);
    cssLoaderGlobal = _extractTextWebpackPlugin2.default.extract('style', cssLoaderGlobal);
    lessLoader = _extractTextWebpackPlugin2.default.extract('style', lessLoader);
  } else {
    cssLoaderLocal = 'style!' + cssLoaderLocal;
    cssLoaderGlobal = 'style!' + cssLoaderGlobal;
    lessLoader = 'style!' + lessLoader;
  }
  if (cssModules) {
    return [{
      test: /\.css$/,
      loader: cssLoaderLocal,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: cssLoaderGlobal,
      include: /node_modules/
    }, {
      test: /\.less$/,
      loader: lessLoader
    }];
  } else {
    return [{
      test: /\.css$/,
      loader: cssLoaderGlobal
    }, {
      test: /\.less$/,
      loader: lessLoader
    }];
  }
};