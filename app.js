const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')

const usersRoutes = require('./routes/users')
const googleRoutes = require('./routes/google')

const calendar = require('./init/googleCalendar')

const app = express()

const config = require('./config/config')
const _config = config.readConfig()

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

calendar.init(app, _config)

app.use('/users', usersRoutes)
app.use('/google', googleRoutes)

const compiler = webpack(webpackConfig)
const middleware = webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})

app.use(middleware)

app.get('*', (request, response) => {
  response.write(middleware.fileSystem.readFileSync(
    path.join(__dirname, '/public/dist/index.html'))
  )
  response.end()
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
// error handler
app.use((error, req, res) => {
  // set locals, only providing error in development
  res.locals.message = error.message
  res.locals.error = req.app.get('env') === 'development' ? error : {}
  // render the error page
  res.status(error.status || 500)
  res.json({error})
})

module.exports = app
