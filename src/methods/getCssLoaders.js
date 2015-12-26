import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default ({ production, cssModules }) => {
  // accept a boolean depending on env is production or not
  // accept a boolean to decide css modules or not
  let cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
  let cssLoaderGlobal = 'css';
  let lessLoader = 'css!less';
  if (production) {
    cssLoaderLocal = ExtractTextPlugin.extract('style', cssLoaderLocal);
    cssLoaderGlobal = ExtractTextPlugin.extract('style', cssLoaderGlobal);
    lessLoader = ExtractTextPlugin.extract('style', lessLoader);
  } else {
    cssLoaderLocal = 'style!' + cssLoaderLocal;
    cssLoaderGlobal = 'style!' + cssLoaderGlobal;
    lessLoader = 'style!' + lessLoader;
  }
  if (cssModules) {
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
}
