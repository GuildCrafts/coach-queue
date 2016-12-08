const init = function(expressApp, config) {
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var session = require('express-session');

  expressApp.use(session({ secret: 'keyboard cat' }));
  expressApp.use(passport.initialize());

  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.client_secret,
      callbackURL: 'http://localhost:3000/google/auth/callback',
      scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
    },
    function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  ));
}

module.exports = {init};
