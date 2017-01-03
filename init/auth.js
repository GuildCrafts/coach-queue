const init = function(expressApp, config) {
  const {
    addUserToRequestFromJWT,
    extendJWTExpiration,
    refreshUserFromIDMService
  } = require('@learnersguild/idm-jwt-auth/lib/middlewares')

  //need to do this as idm-jwt-auth token needs this
  process.env.JWT_PUBLIC_KEY  = config.auth.JWT_PUBLIC_KEY

  expressApp.use(addUserToRequestFromJWT)
  const ensureUserLoggedIn = (req, res, next) => {
    console.log('request.session::', req.session);
    console.log('request.user::', req.user);
    const redirectTo = encodeURIComponent(config.host_fully_qualified)
    if (!req.user) {
      return res.redirect(`${config.auth.IDM_BASE_URL}/sign-in?redirect=${redirectTo}`)
    }
    next()
  }
  expressApp.use(ensureUserLoggedIn)
}

module.exports = {init}
