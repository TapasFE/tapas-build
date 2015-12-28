import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export default (config) => {

  var app = express()

  var compiler = webpack(config)
  var options = {
    noInfo: true,
    quiet: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }

  app.use(webpackDevMiddleware(compiler, options))
  app.use(webpackHotMiddleware(compiler))

  app.get('*', function (req, res) {
    res.redirect('/static/')
  })

  app.listen(55555, 'localhost', function (err, result) {
    if (err) {
      console.log(err)
      return
    }

    console.log('Listening at http://localhost: 55555')
  })
}
