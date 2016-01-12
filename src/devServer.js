import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from './dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { findAPortNotInUse } from 'portscanner';
import proxy from 'express-http-proxy';
import url from 'url';

const serverStart = (app, port) => {
  app.listen(port, 'localhost', (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Listening at http://localhost:%d', port);
  });
};

export default (config, port, args) => {

  var app = express();

  var compiler = webpack(config);
  var options = {
    noInfo: true,
    quiet: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  };

  if (args.proxy) {
    Object.keys(args.proxy).forEach(key => {
      app.use(key, proxy(url.parse(args.proxy[key]).host, {
        forwardPath: (req, res) => {
          const pathname = (url.parse(args.proxy[key]).pathname ==='/' ? '' : url.parse(args.proxy[key]).pathname) + req.url;
          console.log(`Request: ${req.url}`);
          console.log(
`Target: {
  Host: ${url.parse(args.proxy[key]).host},
  Pathname: ${pathname}
}`);
          return pathname;
        }
      }));
    });
  }
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
