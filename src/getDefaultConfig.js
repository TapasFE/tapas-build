import {join} from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import babelrc from './getBabelrc';

let getCommonConfig = {
  getEntry: function (args) {
    const main = join(args.cwd, args.entry) || pkg.entry
    if (args.production) {
      return main
    } else {
      return {
        main: main,
        vendor: [
          'webpack-hot-middleware/client'
        ]
      }
    }
  },
  getLoaders: function(args) {
    let name = args.hash
      ? '[name].[hash:8].[ext]'
      : '[name].[ext]';
    const babelQuery = {
      presets: babelrc.presets,
      plugins: args.env === 'production' ? args.plugins : args.devPlugins
    };
    const loaders = [
      {
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
          name: `images/${name}`
        }
      }, {
        test: /\.woff$/,
        loader: 'url',
        query: {
          limit: 100,
          mimetype: 'application/font-woff',
          name: `fonts/${name}`
        }
      }, {
        test: /\.woff2$/,
        loader: 'url',
        query: {
          limit: 100,
          mimetype: 'application/font-woff2',
          name: `fonts/${name}`
        }
      }, {
        test: /\.ttf$/,
        loader: 'url',
        query: {
          limit: 100,
          mimetype: 'application/octet-stream',
          name: `fonts/${name}`
        }
      }, {
        test: /\.eot$/,
        loader: 'url',
        query: {
          limit: 100,
          name: `fonts/${name}`
        }
      }, {
        test: /\.svg$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'image/svg+xml',
          name: `fonts/${name}`
        }
      }
    ];
    return loaders.concat(this.getCssLoaders(args))
  },
  getCssLoaders: function(args) {
    let cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
    let cssLoaderGlobal = 'css!postcss?pack=default';
    let lessLoader = 'css!less';
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
        {
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
        }
      ];
    } else {
      return [
        {
          test: /\.css$/,
          loader: cssLoaderGlobal
        }, {
          test: /\.less$/,
          loader: lessLoader
        }
      ]
    }
  },
  getPluigns: function(args) {
    const cssName = args.hash
      ? '[name].[hash:8].css'
      : '[name].css';
    let plugins = [
      new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(args.env)}),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
      new HtmlWebpackPlugin({ template: args.index, inject: 'body' }),
      new webpack.HotModuleReplacementPlugin()
    ];
    if (args.production)
      plugins = [
        ...plugins,
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: false
        })
      ];
    if (args.extractCss) {
      return plugins.concat([new ExtractTextPlugin(cssName, {allChunks: true})])
    } else {
      return plugins
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

export default function getDefaultConfig(args) {
  let pkg = require(join(args.cwd, 'package.json'));

  const jsName = args.hash
    ? '[name].[chunkhash:8].js'
    : '[name].js';

  return {
    devtool: args.devtool || 'eval',
    debug: true,
    bail: true,
    entry: getCommonConfig.getEntry(args),
    output: {
      path: join(args.cwd, args.output) || join(args.cwd, 'build'),
      filename: jsName,
      publicPath: args.publicPath
    },
    module: {
      loaders: getCommonConfig.getLoaders(args)
    },
    resolve: {
      fallback: join(__dirname, '../node_modules'),
      extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
      //must set to resolve the loader from tapas-build, not process.cwd
      root: join(__dirname, '../node_modules')
    },
    plugins: getCommonConfig.getPluigns(args),
    postcss: function() {
      return {
          default:
          [
            require('autoprefixer')({browsers: ['last 2 versions']})
          ]
        }
      }
    }
  }
