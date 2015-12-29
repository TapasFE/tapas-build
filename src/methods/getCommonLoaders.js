import babelrc from './getBabelrc';

export default ({ production, entry }) => {
  // accept a boolean depending on env is production or not
  let name = production
    ? '[name].[hash:8].[ext]'
    : '[name].[ext]';
  const babelQuery = {
    presets: babelrc.presets,
    plugins: production ? babelrc.plugins : babelrc.devPlugins
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
  return loaders;
}