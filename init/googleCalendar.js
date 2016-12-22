const init = function(expressApp, config) {
  const passport = require('passport')
  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

  expressApp.use(passport.initialize())

  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.client_secret,
      callbackURL: config.host + config.google.callbackURLPath,
      scope: config.google.scopes
    },
    function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken
      return done(null, profile)
    }
  ))
}

module.exports = {init}
