const init = function(app) {
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var session = require('express-session');

  app.use(session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());

  const gconfig = {
    clientID		: "259173355137-rcgi9a201b12oj2r6fq3kvepbd58n288.apps.googleusercontent.com",
    client_secret : "Tl2ZvO_G8e_py4309tQUQWGR"
  }

  passport.use(new GoogleStrategy({
      clientID: gconfig.clientID,
      clientSecret: gconfig.client_secret,
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
