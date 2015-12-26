import { join, resolve } from 'path';

import webpack from 'webpack';

import getEntry from './methods/getEntry';
import getCommonLoaders from './methods/getCommonLoaders';
import getCssLoaders from './methods/getCssLoaders';
import getPluigns from './methods/getPlugins';

export default function getDefaultConfig(args) {

  return {
    devtool: args.production ? false : 'cheap-module-eval-source-map',
    debug: Boolean(args.production),
    entry: getEntry(args),
    output: {
      path: args.output || join(args.cwd, 'build'),
      filename: args.production ? '[name].[chunkhash:8].js' : '[name].js',
      publicPath: args.production ? args.publicPath : '/static/'
    },
    module: {
      // preLoaders: [{
      //   test: resolve(args.entry),
      //   loader: 'render-placement',
      //   query: {
      //     replace: false,
      //     id: 'root'
      //   }
      // }],
      loaders: getCommonLoaders(args).concat(getCssLoaders(args))
    },
    resolve: {
      fallback: join(__dirname, '../node_modules'),
      extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
      //must set to resolve the loader from tapas-build, not process.cwd
      root: join(__dirname, '../node_modules')
    },
    plugins: getPluigns(args),
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
