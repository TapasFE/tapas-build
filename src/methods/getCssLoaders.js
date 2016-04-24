import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default ({ extractCss, cssModules }) => {
  // accept a boolean to decide css modules or not
  let cssLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default';
  let cssLoaderGlobal = 'css!postcss?pack=default';
  let lessLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=default!less';
  let lessLoaderGlobal = 'css!postcss?pack=default!less';
  let sassLoaderLocal = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=sass';
  let sassLoaderGlobal = 'css?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?pack=sass';
  if (extractCss) {
    cssLoaderLocal = ExtractTextPlugin.extract('style', cssLoaderLocal);
    cssLoaderGlobal = ExtractTextPlugin.extract('style', cssLoaderGlobal);
    lessLoaderLocal = ExtractTextPlugin.extract('style', lessLoaderLocal);
    lessLoaderGlobal = ExtractTextPlugin.extract('style', lessLoaderGlobal);
    sassLoaderLocal = ExtractTextPlugin.extract('style', sassLoaderLocal);
    sassLoaderGlobal = ExtractTextPlugin.extract('style', sassLoaderGlobal);
  } else {
    cssLoaderLocal = 'style!' + cssLoaderLocal;
    cssLoaderGlobal = 'style!' + cssLoaderGlobal;
    lessLoaderLocal = 'style!' + lessLoaderLocal;
    lessLoaderGlobal = 'style!' + lessLoaderGlobal;
    sassLoaderLocal = 'style!' + sassLoaderLocal;
    sassLoaderGlobal = 'style!' + sassLoaderGlobal;
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
      }, {
        test: /\.(sass|scss)$/,
        loader: sassLoaderLocal,
        exclude: /node_modules/
      }, {
        test: /\.(sass|scss)$/,
        loader: sassLoaderGlobal,
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
      }, {
        test: /\.(sass|scss)$/,
        loader: sassLoaderGlobal
      }
    ]
  }
}
