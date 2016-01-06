import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from './dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { findAPortNotInUse } from 'portscanner';

const serverStart = (app, port) => {
  app.listen(port, 'localhost', (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Listening at http://localhost:%d', port);
  });
};

export default (config, port) => {

  var app = express();

  var compiler = webpack(config);
  var options = {
    noInfo: true,
    quiet: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  };

  app.use(webpackDevMiddleware(compiler, options));
  app.use(webpackHotMiddleware(compiler));

  if (port) {
    serverStart(app, port);
  } else {
    findAPortNotInUse(8080, 10080, 'localhost', (error, _port) => {
      serverStart(app, _port);
    });
  }
}
