const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')

const coach = require('./routes/coach')
const appointment = require('./routes/appointment')
const googleRoutes = require('./routes/google')
const calendarRoutes = require('./routes/calendar')

const calendar = require('./init/googleCalendar')

const app = express()

const config = require('./config/config')
const _config = config.readConfig()

app.use(session({secret: 'learnersguildsecretkey-coach-que'}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

calendar.init(app, _config)

const ensureGoogleAuth = (req, res, next) =>
  req.session.access_token ? next() : res.redirect('/google/auth')

app.use('/api/v1/coaches', coach)
app.use('/api/v1/appointments', appointment)
app.use('/google', googleRoutes)
app.use(ensureGoogleAuth)
app.use('/calendar', calendarRoutes)

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

app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.json({error:err})
})

module.exports = app
