import { join } from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

export default function(args, callback) {
  args.cwd = args.cwd || process.cwd();
}