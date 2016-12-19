const init = function(expressApp, config) {
  const {
    addUserToRequestFromJWT,
    extendJWTExpiration,
    refreshUserFromIDMService
  } = require('@learnersguild/idm-jwt-auth/lib/middlewares')

  expressApp.use(addUserToRequestFromJWT)
  const ensureUserLoggedIn = (req, res, next) => {
    const redirectTo = encodeURIComponent(_config.host_fully_qualified)
    console.log({user: req.user})
    if (!req.user) {
      res.redirect('http://idm.learnersguild.dev/sign-in?redirect=http%3A%2F%2Fcoach-que.learnersguild.dev')
      return next()
    }
    next()
  }
  expressApp.use(ensureUserLoggedIn)
}

module.exports = {init}
