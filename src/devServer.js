import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { findAPortNotInUse } from 'portscanner';

export default (config) => {

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

  app.get('*', function (req, res) {
    res.redirect('/static/');
  });

  findAPortNotInUse(8080, 10080, 'localhost', (error, port) => {
    app.listen(port, 'localhost', (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Listening at http://localhost: %d', port);
    });
  })
}
