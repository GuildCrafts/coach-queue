const init = function(expressApp, config) {
  const passport = require('passport')
  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

  expressApp.use(passport.initialize())

  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.client_secret,
      callbackURL: config.host_fully_qualified + config.google.callbackURLPath,
      scope: config.google.scopes
    },
    function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken
      profile.refreshToken = refreshToken
      return done(null, profile)
    }
  ))
}

module.exports = {init}
