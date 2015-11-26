import { join } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

let defaultConfig = {
  getEntry: function (hot, cwd) {
    let vendor = [];
    if (hot) {
      vendor.concat([
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server'
      ]);
    }
    return {
      main: join(cwd, 'client/main'),
      vendor: vendor
    };
  },
  getOutput: function (dev, cwd) {
    let filename = dev ? '[name].js' : '[name].[chunkhash:8].js'
    return {
      path: join(cwd, 'build'),
      filename: filename,
      publicPath: '/static/'  // when `production`, it should be a cdn prefix
    };
  },
  getLoders: function (hot) {
    let jsLoader = hot ? 'react-hot!babel' : 'babel';
    let name = hot ? '[name].[ext]': '[name].[hash:8].[ext]';
    return [
      { test: /\.js$/, loader: jsLoader, exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=2048', name: `images/${name}` },
      { test: /\.woff$/, loader: 'url?limit=100&minetype=application/font-woff', name: `fonts/${name}` },
      { test: /\.woff2$/, loader: 'url?limit=100&minetype=application/font-woff2', name: `fonts/${name}` },
      { test: /\.ttf$/, loader: 'url?limit=100&minetype=application/octet-stream', name: `fonts/${name}` },
      { test: /\.eot$/, loader: 'url?limit=100', name: `fonts/${name}` },
      { test: /\.svg$/, loader: 'url?limit=10000&minetype=image/svg+xml', name: `fonts/${name}` }
    ];
  },
  getCssLoaders: function(extractCss) {
    let cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
    let cssLoaderGlobal= 'css!postcss?pack=default';
    let lessLoader = 'css?importLoaders=1!less!postcss?pack=default'
    if (extractCss) {
      cssLoaderLocal = ExtractTextPlugin.extract('style', cssLoaderLocal);
      cssLoaderGlobal = ExtractTextPlugin.extract('style', cssLoaderGlobal);
      lessLoader = ExtractTextPlugin.extract('style', lessLoader);
    } else {
      cssLoaderLocal = 'style!' + cssLoaderLocal;
      cssLoaderGlobal = 'style!' + cssLoaderGlobal;
      lessLoader = 'style!' + lessLoader;
    }
    return [
      { test: /\.css$/, loader: cssLoaderLocal, exclude: /node_modules/ },
      { test: /\.css$/, loader: cssLoaderGlobal, include: /node_modules/ },
      { test: /\.less$/, loader: lessLoader, include: /node_modules/ }
    ];
  },
  getResolve: function () {
    return {
      extensions: ['', '.js']
    };
  },
  getPluigns: function (dev) {
    let plugins = [
      new webpack.optimize.OccurrenceOrderPlugin()
    ];
    let pluginsExtend = dev ? this.getDevPlugins() : this.getPordPlugins()
    return plugins.concat(pluginsExtend)
  },
  getDevPlugins: function () {
    return [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ];
  },
  getPordPlugins: function () {
    return [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[chunkhash:8].js', minChunks: Infinity }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }),
      new ExtractTextPlugin('[name].[chunkhash:8].css', { allChunks: true })
    ];
  }
}

export default function getDefaultConfig(args) {
  const dev = args.environment == 'production' ? false : true
  return {
    devtool: dev ? 'eval' : false,
    entry: defaultConfig.getEntry(dev, args.cwd),
    output: defaultConfig.getOutput(dev, args.cwd),
    module: {
      loaders: defaultConfig.getLoders(dev).concat(defaultConfig.getCssLoaders(!dev))
    },
    resolve: defaultConfig.getResolve(),
    plugins: defaultConfig.getPluigns(dev),
    postcss: function () {
      return {
        default: [ require('autoprefixer')({ browsers: ['last 2 versions'] }) ]
      }
    }
  }
}
