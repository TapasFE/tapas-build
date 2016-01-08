import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default ({ extractCss, cssModules }) => {
  // accept a boolean to decide css modules or not
  let cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
  let cssLoaderGlobal = 'css!postcss?pack=default';
  let lessLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default!less';
  let lessLoaderGlobal = 'css!postcss?pack=default!less';
  if (extractCss) {
    cssLoaderLocal = ExtractTextPlugin.extract('style', cssLoaderLocal);
    cssLoaderGlobal = ExtractTextPlugin.extract('style', cssLoaderGlobal);
    lessLoaderLocal = ExtractTextPlugin.extract('style', lessLoaderLocal);
    lessLoaderGlobal = ExtractTextPlugin.extract('style', lessLoaderGlobal);
  } else {
    cssLoaderLocal = 'style!' + cssLoaderLocal;
    cssLoaderGlobal = 'style!' + cssLoaderGlobal;
    lessLoaderLocal = 'style!' + lessLoaderLocal;
    lessLoaderGlobal = 'style!' + lessLoaderGlobal;
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
        loader: lessLoaderLocal,
        exclude: /node_modules/
      }, {
        test: /\.less$/,
        loader: lessLoaderGlobal,
        include: /node_modules/
      }
    ];
  } else {
    return [
      {
        test: /\.css$/,
        loader: cssLoaderGlobal
      }, {
        test: /\.less$/,
        loader: lessLoaderGlobal
      }
    ]
  }
}
