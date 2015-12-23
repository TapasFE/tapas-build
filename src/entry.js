import { join } from 'path';
import { access, F_OK, R_OK } from 'fs';
import rimraf from 'rimraf';
import webpack from 'webpack';
import getConfig from './getConfig';
import devServer from './devServer';

export default function(args, callback) {
  args.cwd = args.cwd || process.cwd();
  args.env = args.production ? 'production' : 'development';

/**
  * hash {Boolean} determine to hash js/css or not, default `true`
  * extractCss {Boolean} determine to extract css file or not, default `true`
  * cssModules {Boolean} determine to make css(exclude /node_modules/) modular or not, default `true`
  * publicPath {String} could be a cdn prefix, default `/static/`
**/

  args.hash = args.env === 'production';
  args.extractCss = args.env === 'production';
  args.cssModules = args.cssModules || true;
  args.publicPath = args.publicPath || '/static/';
  args.entry = args.args[0];
  args.output = args.args[1];

  const indexFile = join(args.cwd, args.index || 'index.html');

  access(indexFile, F_OK | R_OK, (err) => {
    if (err) {
      throw new Error('You don\'t have a index.html to inject css and js!');
    } else {
      args.index = indexFile;
    }
  });

  const outputPath = join(args.cwd, args.output);
  const config = getConfig(args);

  if (args.production) {
    access(outputPath, F_OK, (err) => {
      if (!err) {
        rimraf(outputPath, () => {
          console.log('The output path is clean');
        });
      }
    });

    webpack(config, (err, stats) => {
      console.log(err);
      console.log(stats);
    });
  } else {
    devServer(config);
  }
}

module.exports = exports["default"];
