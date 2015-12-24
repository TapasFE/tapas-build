import { join } from 'path';
import isPlainObject from 'is-plain-object';

/**
 * Merge custom config from `webpack.config.js`.
 * @param defaultConfig {Object}
 * @param args          {Object}
 */
export default function mergeCustomConfig(defaultConfig, args) {

  if (!args.config) {
    return defaultConfig;
  }

  const customConfig = require(join(args.cwd, args.config));

  if (isPlainObject(customConfig)) {
    return customConfig;
  } else if (typeof customConfig === 'function') {
    return customConfig(defaultConfig, args.env);
  }

  throw new Error('webpack.config.js must return an object or a function.');

}
