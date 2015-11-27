import { join } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

let getCommonConfig = {
  getLoders: function (args) {
    let name = args.hash ? '[name].[hash:8].[ext]' : '[name].[ext]';
    const babelQuery = {
      presets: ['stage-0', 'es2015', 'react']
    };
    const loaders = [
      { test: /\.js$/, loader: 'babel', query: babelQuery, exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(png|jpg|gif)$/, loader: 'url', query: { limit: 2048, name: `images/${name}` } },
      { test: /\.woff$/, loader: 'url', query: { limit: 100, minetype: 'application/font-woff', name: `fonts/${name}` } },
      { test: /\.woff2$/, loader: 'url', query: { limit: 100, minetype: 'application/font-woff2', name: `fonts/${name}` } },
      { test: /\.ttf$/, loader: 'url', query: { limit: 100, minetype: 'application/octet-stream', name: `fonts/${name}` } },
      { test: /\.eot$/, loader: 'url', query: { limit: 100, name: `fonts/${name}` } },
      { test: /\.svg$/, loader: 'url', query: { limit: 10000, minetype: 'image/svg+xml', name: `fonts/${name}` } }
    ];
    return loaders.concat(this.getCssLoaders(args))
  },
  getCssLoaders: function (args) {
    let cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
    let cssLoaderGlobal = 'css!postcss?pack=default';
    let lessLoader = 'css?importLoaders=1!less!postcss?pack=default'
    if (args.extractCss) {
      cssLoaderLocal = ExtractTextPlugin.extract('style', cssLoaderLocal);
      cssLoaderGlobal = ExtractTextPlugin.extract('style', cssLoaderGlobal);
      lessLoader = ExtractTextPlugin.extract('style', lessLoader);
    } else {
      cssLoaderLocal = 'style!' + cssLoaderLocal;
      cssLoaderGlobal = 'style!' + cssLoaderGlobal;
      lessLoader = 'style!' + lessLoader;
    }
    if (args.cssModules) {
      return [
        { test: /\.css$/, loader: cssLoaderLocal, exclude: /node_modules/ },
        { test: /\.css$/, loader: cssLoaderGlobal, include: /node_modules/ },
        { test: /\.less$/, loader: lessLoader, include: /node_modules/ }
      ];
    } else {
      return [
        { test: /\.css$/, loader: cssLoaderGlobal },
        { test: /\.less$/, loader: lessLoader }
      ]
    }
  },
  getPluigns: function (args) {
    const vendorJsName = args.hash ? 'vendor.[chunkhash:8].js' : 'vendor.js';
    const cssName = args.hash ? '[name].[chunkhash:8].js' : '[name].js';
    let plugins = [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(args.env) }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: vendorJsName, minChunks: Infinity }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
    ]
    if (args.extractCss) {
      return plugins.concat([
        new ExtractTextPlugin(cssName, { allChunks: true })
      ])
    }
  }
}

/** args {Object}
  * args = {
  *   ...
  *   cwd {String} process.cwd
  *   devtool {String} choost webpack devtool, `false` recommended
  *   publicPath {String} could be a cdn prefix, default `/static/`
  *   hash {Boolean} determine to hash js/css or not, default `true`
  *   extractCss {Boolean} determine to extract css file or not, default `true`
  *   cssModules {Boolean} determine to make css(exclude /node_modules/) modular or not, default `true`
  *   ...
  * }
**/

export default function getDefaultConfig (args) {
  let pkg = require(join(args.cwd, 'package.json'));

  const jsName = args.hash ? '[name].[chunkhash:8].js' : '[name].js';

  return {
    devtool: args.devtool || false,
    entry: pkg.entry,
    output: {
      path: join(args.cwd, 'build'),
      filename: jsName,
      publicPath: args.publicPath || '/static/'
    },
    module: {
      loaders: getCommonConfig.getLoders(args)
    },
    resolve: {
      extensions: ['', '.js']
    },
    plugins: getCommonConfig.getPluigns(args),
    postcss: function () {
      return {
        default: [ require('autoprefixer')({ browsers: ['last 2 versions'] }) ]
      }
    }
  }
}
