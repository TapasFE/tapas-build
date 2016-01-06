'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _fs = require('fs');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _getConfig = require('./getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _devServer = require('./devServer');

var _devServer2 = _interopRequireDefault(_devServer);

var _rawHTML = require('./constant/rawHTML');

var _rawHTML2 = _interopRequireDefault(_rawHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (args, callback) {
  args.cwd = args.cwd || process.cwd();
  args.publicPath = args.publicPath || './';
  // 根据<index>确定是否为组件或者网站
  args.isComponent = args.index ? false : true;
  // 组件不采用css modules
  args.cssModules = !args.isComponent;
  // 初始化args下hash与extractCss属性
  var checker = args.production && !args.isComponent;
  args.hash = checker;
  args.extractCss = checker;

  var pkg = require((0, _path.join)(args.cwd, './package.json'));

  // 检验tapas参数是否存在
  var tapas = pkg.tapas;
  if (tapas) {
    var entry = tapas.entry;
    var vendor = tapas.vendor;
    var output = tapas.output;
    var index = tapas.index;
    var babelLoaderPlugins = tapas.babelLoaderPlugins;
    var port = tapas.port;
  } else {
    var entry, vendor, output, index, babelLoaderPlugins, port;
  }

  vendor = vendor || [];
  if (!args.isComponent && args.production) vendor.unshift(require.resolve('tapas-externals'));

  // 查找babel-loader-plugins，其为数组时，挂到args
  args.babelLoaderPlugins = Array.isArray(babelLoaderPlugins) ? babelLoaderPlugins : [];

  var inputArgs = args.args;
  // 先赋值到`args`上，再验证参数是否正确
  switch (inputArgs.length) {
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
    args.index = _rawHTML2.default.replace(/pkgName/, pkg.name);
  } else {
    var indexPath = (0, _path.join)(args.cwd, args.index);
    (0, _fs.accessSync)(indexPath, _fs.F_OK | _fs.R_OK);
    args.index = (0, _fs.readFileSync)(indexPath, 'utf8');
  }

  // 统一转化成绝对路径
  if (args.entry) {
    args.entry = (0, _path.join)(args.cwd, args.entry);
  } else {
    throw new Error('You should give a `entry` to render this project');
  }

  if (args.production && !args.output) {
    throw new Error('You should give a `output` when env is production');
  } else {
    args.output = (0, _path.join)(args.cwd, args.output);
  }

  // <entry> file 是否存在
  (0, _fs.access)(args.entry, _fs.F_OK | _fs.R_OK, function (err) {
    if (err) {
      throw new Error('The entry file in ' + args.entry + ' don\'t existed');
    }
  });

  // `vendor` 是否为数组
  if (!Array.isArray(args.vendor)) {
    throw new Error('You should config `vendor` as a array');
  }

  var config = (0, _getConfig2.default)(args);

  if (args.production) {
    (function () {
      // <output> 是否存在，如果存在则 `rm -rf`
      var outputPath = args.output;
      if ((0, _path.join)(args.cwd, './') !== (0, _path.join)(outputPath, './')) {
        (0, _fs.access)(outputPath, _fs.F_OK, function (err) {
          if (!err) {
            (0, _rimraf2.default)(outputPath, function () {
              console.log('The output path is clean');
            });
          }
        });
      }

      var compiler = (0, _webpack2.default)(config, function (err, stats) {
        //console.log(compiler);
      });
    })();
  } else {
      (0, _devServer2.default)(config, port);
    }
};

module.exports = exports["default"];