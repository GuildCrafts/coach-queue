const express = require('express')
const router = express.Router()
const passport = require('passport')
const {updateUserByHandle} = require('../io/database/users')
const config = require('../config/config').readConfig()

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.get('/auth',
           passport.authenticate('google', {scope: config.google.scopes}))

router.get('/auth/callback',
  passport.authenticate('google', {failureRedirect: '/google/auth'}),
  (request, response) => {
    request.session.access_token = request.user.accessToken
    updateUserByHandle(request.idmUser.handle,
                       {google_token: request.user.accessToken})
     .then(user => response.redirect('/'))
  })

// TODO
// ERROR HANDLING
// an error I got back from google that needs to be sorted out:
// {"error":{"name":"InternalOAuthError",
  // "message":"failed to obtain access token",
  // "oauthError":{"statusCode":400,"data":"{\n  \"error\" : \"invalid_grant\",\n  \"error_description\" : \"Code was already redeemed.\"\n}"}}}

module.exports = router
