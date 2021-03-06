import { join, dirname } from 'path';
import { readFileSync, access, accessSync, F_OK, R_OK } from 'fs';
import rimraf from 'rimraf';
import webpack from 'webpack';

import getConfig from './getConfig';
import devServer from './devServer';
import rawHTML from './constant/rawHTML';

export default (args, callback) => {
  args.cwd = args.cwd || process.cwd();


  const pkg = require(join(args.cwd, './package.json'));

  // 检验tapas参数是否存在
  const tapas = pkg.tapas;
  if (tapas) {
    var { entry, vendor, output, index, babelLoaderPlugins, port, cssModules, autoExternals, resolveRoot, rootAlias, proxy } = tapas;
  } else {
    var entry, vendor, output, index, babelLoaderPlugins, port, cssModules, autoExternals, resolveRoot, rootAlias, proxy;
  }

  //用命令行参数覆盖package.json里的参数
  if(args.args.length === 1) throw new Error('You should use `tapas-build <entry> <output>`');
  args.entry = args.args[0] || entry;
  args.output = args.args[1] || output;
  args.index = args.index || index;
  args.vendor = vendor || [];
  args.cssModules = cssModules || false;

  args.publicPath = args.publicPath || './';
  // 查找babel-loader-plugins，其为数组时，挂到args
  args.babelLoaderPlugins = Array.isArray(babelLoaderPlugins) ? babelLoaderPlugins : [];

  // 默认关闭autoExternals
  args.autoExternals = autoExternals || false;

  // -----------开始根据输入参数确定内部变量---------------------

  // 初始化部分属性(isComponent)
  // 根据<index>确定是否为组件或者网站
  args.isComponent = args.index ? false : true;
  // 初始化args下hash与extractCss属性
  const checker = args.production && !args.isComponent;
  args.hash = checker;
  args.extractCss = checker;

  args.proxy = proxy;

  // 验证<entry>{String} <output>{String} <vendor>{Array} <index>{String}四个参数的是否正确
  if(typeof args.entry !== 'string') throw new Error('Entry must be a string');
  if(typeof args.output !== 'string') throw new Error('Output must be a string');

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

  // require默认从resolveRoot处解析，如果没有提供，resolveRoot为entry所在文件夹
  args.resolveRoot = resolveRoot ? join(args.cwd, resolveRoot) : dirname(args.entry);

  // 默认的根目录alias为#
  args.rootAlias = rootAlias || '#';

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
    //如果在根目录下，不删除
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
    devServer(config, port, args);
  }
}

module.exports = exports["default"];
