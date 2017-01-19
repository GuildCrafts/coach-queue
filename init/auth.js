const {isProduction} = require('../config/config')

const init = function(expressApp, config) {
  const {
    addUserToRequestFromJWT,
    extendJWTExpiration,
    refreshUserFromIDMService
  } = require('@learnersguild/idm-jwt-auth/lib/middlewares')

  //NOTE: need to do this as idm-jwt-auth token needs this env var
  //Also we dont want to store the production key on github
  if(!isProduction()) {
    process.env.JWT_PUBLIC_KEY = config.auth.JWT_PUBLIC_KEY
  }

  expressApp.use(addUserToRequestFromJWT)
  const ensureUserLoggedIn = (req, res, next) => {
    const redirectTo = encodeURIComponent(config.host_fully_qualified)
    if (!req.user) {
      return res.redirect(`${config.auth.IDM_BASE_URL}/sign-in?redirect=${redirectTo}`)
    }
    next()
  }
  expressApp.use(ensureUserLoggedIn)
}

module.exports = {init}
