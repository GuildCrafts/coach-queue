const init = function(expressApp, config) {
  const {
    addUserToRequestFromJWT,
    extendJWTExpiration,
    refreshUserFromIDMService
  } = require('@learnersguild/idm-jwt-auth/lib/middlewares')

  expressApp.use(addUserToRequestFromJWT)
  const ensureUserLoggedIn = (req, res, next) => {
    const redirectTo = encodeURIComponent(config.host_fully_qualified)
    if (!req.user) {
      res.redirect(`${config.auth.IDM_BASE_URL}/sign-in?redirect=${redirectTo}`)
      return next()
    }
    next()
  }
  expressApp.use(ensureUserLoggedIn)
}

module.exports = {init}
