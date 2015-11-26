import { join } from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';
import getConfig from './getConfig';

export default function(args, callback) {
  args.cwd = args.cwd || process.cwd();
  args.env = args.production ? 'production' : 'development';

  const config = getConfig(args);

}

module.exports = exports["default"];