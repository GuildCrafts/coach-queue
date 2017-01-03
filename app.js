const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport');

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')
const {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} = require('@learnersguild/idm-jwt-auth/lib/middlewares')

const coach = require('./routes/coach')
const appointment = require('./routes/appointment')
const googleRoutes = require('./routes/google')
const calendarRoutes = require('./routes/calendar')

const calendar = require('./init/googleCalendar')
const auth = require('./init/auth')

const app = express()

const config = require('./config/config')
const _config = config.readConfig()
const session = require('express-session')


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({secret: 'learners-guild-coach-que'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

//we dont have a dev IDM, so
if (!_config.auth.isDisabled) {
  auth.init(app, _config)
  app.use((req, res, next) => {
    //Note: Since we are also using Passport, req.user is overriden on those
    //routes
    req.idmUser = req.user
    next()
  })
}

app.use(cors())

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })

app.use('/google', googleRoutes)
app.use('/api/v1/coaches', coach)
app.use('/api/v1/appointments', appointment)


calendar.init(app, _config)
app.use('/calendar', calendarRoutes)

//we dont have a dev IDM, so

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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({error:err.stack})
})

module.exports = app
