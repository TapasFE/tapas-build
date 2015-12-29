import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default ({ production, index, vendor, isComponent }) => {
  // accept a boolean depending on env is production or not
  const vendorJsName = production
    ? '[name].[chunkhash:8].js'
    : '[name].js';
  const cssName = production
    ? '[name].[chunkhash:8].css'
    : '[name].css';
  const env = production
    ? '"production"'
    : '"development"';
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
  if (!isComponent || !production) {
    plugins = [
      ...plugins,
      new HtmlWebpackPlugin({ templateContent: index, minify: {collapseWhitespace: true}, inject: 'body' }),
    ];
  }
  if (production) {
    plugins = [
      ...plugins,
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: false
      }),
      new ExtractTextPlugin(cssName, {allChunks: true})
    ];
  } else {
    plugins = [
      ...plugins,
      new webpack.HotModuleReplacementPlugin(),
    ];
  }
  return plugins;
}
