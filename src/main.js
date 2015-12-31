import { join } from 'path';
import { readFileSync, access, accessSync, F_OK, R_OK } from 'fs';
import rimraf from 'rimraf';
import webpack from 'webpack';

import getConfig from './getConfig';
import devServer from './devServer';
import rawHTML from './constant/rawHTML';

export default (args, callback) => {
  args.cwd = args.cwd || process.cwd();
  args.publicPath = args.publicPath || './';
  // 根据<index>确定是否为组件或者网站
  args.isComponent = args.index ? false : true;
  // 组件不采用css modules
  args.cssModules = !args.isComponent;
  // 初始化args下hash与extractCss属性
  const checker = args.production && !args.isComponent;
  args.hash = checker;
  args.extractCss = checker;

  const pkg = require(join(args.cwd, './package.json'));

  // 检验tapas参数是否存在
  const tapas = pkg.tapas;
  if (tapas) {
    var { entry, vendor, output, index, babelLoaderPlugins, port } = tapas;
  } else {
    var entry, vendor, output, index, babelLoaderPlugins, port;
  }

  // 查找babel-loader-plugins，其为数组时，挂到args
  args.babelLoaderPlugins = Array.isArray(babelLoaderPlugins) ? babelLoaderPlugins : [];

  const inputArgs = args.args;
  // 先赋值到`args`上，再验证参数是否正确
  switch(inputArgs.length) {
    case 2:
      // 按照package.json 里`tapas`(忽略其中的entry和vendor选项)的配置项加载
      args.entry = inputArgs[0];
      args.output = inputArgs[1];
      args.vendor = vendor || [];
      args.index = args.index || index;
      break;
    case 1:
      // 报错
      throw new Error('You should use `tapas-build <entry> <output>`');
      break;
    case 0:
      // 按照package.json 里`tapas`的配置项加载
      args.entry = entry;
      args.output = output;
      args.vendor = vendor || [];
      args.index = args.index || index;
      break;
    default:
     // 报错
      throw new Error('You should config `tapas` in package.json');
  }

  // 验证<entry>{String} <output>{String} <vendor>{Array} <index>{String}四个参数的是否正确

  // 将 args.index 转为字符串
  // 若为组件，直接生成新的ReactDOM.render和index.html
  if (!args.index) {
    args.index = rawHTML.replace(/pkgName/, pkg.name);
  } else {
    const indexPath = join(args.cwd, args.index);
    accessSync(indexPath, F_OK | R_OK);
    args.index = readFileSync(indexPath, 'utf8');
  }

  // 统一转化成绝对路径
  if (args.entry) {
    args.entry = join(args.cwd, args.entry);
  } else {
    throw new Error('You should give a `entry` to render this project')
  }

  if (args.production && !args.output) {
    throw new Error('You should give a `output` when env is production')
  } else {
    args.output = join(args.cwd, args.output);
  }

  // <entry> file 是否存在
  access(args.entry, F_OK | R_OK, (err) => {
    if (err) {
      throw new Error(`The entry file in ${args.entry} don\'t existed`);
    }
  })

  // `vendor` 是否为数组
  if (!Array.isArray(args.vendor)) {
    throw new Error('You should config `vendor` as a array');
  }

  const config = getConfig(args);

  if (args.production) {
    // <output> 是否存在，如果存在则 `rm -rf`
    const outputPath = args.output;
    if(join(args.cwd, './') !== join(outputPath, './')){
      access(outputPath, F_OK, (err) => {
        if (!err) {
          rimraf(outputPath, () => {
            console.log('The output path is clean');
          });
        }
      });
    }

    const compiler = webpack(config, (err, stats) => {
      //console.log(compiler);
    });
  } else {
    devServer(config, port);
  }
}

module.exports = exports["default"];
