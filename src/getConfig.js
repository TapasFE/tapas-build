import getCustomConfig from './getCustomConfig';
import getDefaultConfig from './getDefaultConfig';

export default function getWebpackConfig(args) {

  const config = getCustomConfig(getDefaultConfig(args), args);

  return config;

}