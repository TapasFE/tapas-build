import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {externals} from './testExternal';

export default ({ production, index, vendor, isComponent, hash, extractCss }) => {
  // accept a boolean depending on env is production or not
  const env = production
    ? '"production"'
    : '"development"';

  const vendorJsName = hash
    ? '[name].[chunkhash:8].js'
    : '[name].js';
  const cssName = hash
    ? '[name].[chunkhash:8].css'
    : '[name].css';
  let plugins = [
    new webpack.DefinePlugin({'process.env.NODE_ENV': env}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ];
  if (vendor.length) {
    plugins = [
      ...plugins,
      new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: vendorJsName, minChunks: Infinity}),
    ];
  }
  if (extractCss) {
    plugins = [
      ...plugins,
      new ExtractTextPlugin(cssName, {allChunks: true})
    ];
  }
  if (!isComponent || !production) {
    // 在组件打包生产代码时，不生成html
    plugins = [
      ...plugins,
      new HtmlWebpackPlugin({ templateContent: index,  inject: 'body'}),
    ];
  }
  if (production) {
    if(!isComponent) {
      plugins = [
        ...plugins,
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: false
        })
      ];
    }
  } else {
    plugins = [
      ...plugins,
      new webpack.HotModuleReplacementPlugin(),
    ];
  }
  return plugins;
}
