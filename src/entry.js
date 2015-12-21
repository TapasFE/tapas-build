import { join } from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';
import getConfig from './getConfig';

export default function(args, callback) {
  args.cwd = args.cwd || process.cwd();
  args.env = args.production ? 'production' : 'development';

/**
  * hash {Boolean} determine to hash js/css or not, default `true`
  * extractCss {Boolean} determine to extract css file or not, default `true`
  * cssModules {Boolean} determine to make css(exclude /node_modules/) modular or not, default `true`
  * publicPath {String} could be a cdn prefix, default `/static/`
**/

  args.hash = args.hash || true;
  args.extractCss = args.extractCss || true;
  args.cssModules = args.cssModules || true;
  args.publicPath = args.publicPath || '/static/';
  args.entry = args.args[0];
  args.output = args.args[1];

  const config = getConfig(args);
  webpack(config, (err, stats) => {
    console.log(err);
    console.log(stats);
  });
}

module.exports = exports["default"];
