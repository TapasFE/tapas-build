'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _portscanner = require('portscanner');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serverStart = function serverStart(app, port) {
  app.listen(port, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Listening at http://localhost:%d', port);
  });
};

exports.default = function (config, port) {

  var app = (0, _express2.default)();

  var compiler = (0, _webpack2.default)(config);
  var options = {
    noInfo: true,
    quiet: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  };

  app.use((0, _webpackDevMiddleware2.default)(compiler, options));
  app.use((0, _webpackHotMiddleware2.default)(compiler));

  if (port) {
    serverStart(app, port);
  } else {
    (0, _portscanner.findAPortNotInUse)(8080, 10080, 'localhost', function (error, _port) {
      serverStart(app, _port);
    });
  }
};