import { join, resolve } from 'path';

import webpack from 'webpack';

import getEntry from './methods/getEntry';
import getCommonLoaders from './methods/getCommonLoaders';
import getCssLoaders from './methods/getCssLoaders';
import getPluigns from './methods/getPlugins';
import testExternal from './methods/testExternal';

export default function getDefaultConfig(args) {

  let config = {
    devtool: args.production ? false : 'source-map',
    debug: Boolean(args.production),
    entry: getEntry(args),
    output: {
      path: args.output || join(args.cwd, 'build'),
      filename: (args.production && !args.isComponent) ? '[name].[chunkhash:8].js' : '[name].js',
      publicPath: args.production ? args.publicPath : '/',
      library: '[name]',
      libraryTarget:'umd',
      umdNamedDefines: true
    },
    module: {
      loaders: getCommonLoaders(args).concat(getCssLoaders(args))
    },
    resolve: {
      fallback: join(__dirname, '../node_modules'),
      extensions: ['', '.js', '.jsx'],
      alias: {
        [args.rootAlias]: args.resolveRoot
      },
      unsafeCache: true
    },
    resolveLoader: {
      //must set to resolve the loader from tapas-build, not process.cwd
      root: join(__dirname, '../node_modules')
    },
    plugins: getPluigns(args),
    postcss: function() {
      return {
        default: [
          require('autoprefixer')({browsers: ['last 2 versions']})
        ]
      }
    },
    ...(args.autoExternals ? {externals: testExternal} : {})
  }

  // 组件在非生产环境下增加render方法
  if (args.isComponent && !args.production) {
    config.module.preLoaders = [{
      test: resolve(args.entry),
      loader: 'render-placement',
      query: {
        replace: false,
        id: 'root'
      }
    }]
  }

  return config
}
