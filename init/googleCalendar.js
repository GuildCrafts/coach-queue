const init = (expressApp, config) => {
  const passport = require('passport')
  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

  expressApp.use(passport.initialize())

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENTID || config.google.clientID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || config.google.client_secret,
      callbackURL: config.host_fully_qualified + config.google.callbackURLPath,
      scope: config.google.scopes
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken
      profile.refreshToken = refreshToken
      return done(null, profile)
    }
  ))
}

module.exports = {init}
