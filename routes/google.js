const express = require('express')
const router = express.Router()
const passport = require('passport')
const {updateUserByHandle} = require('../io/database/users')

router.get('/auth',
  passport.authenticate('google', { session: false }))

router.get('/auth/callback',
  passport.authenticate('google', {session: false, failureRedirect: '/login'}),
  (request, response) => {
    request.session.access_token = request.user.accessToken
    console.log('am i getting redirected here??')
    response.redirect('/')
  })

// ERROR HANDLING
// an error I got back from google that needs to be sorted out: 
// {"error":{"name":"InternalOAuthError",
  // "message":"failed to obtain access token",
  // "oauthError":{"statusCode":400,"data":"{\n  \"error\" : \"invalid_grant\",\n  \"error_description\" : \"Code was already redeemed.\"\n}"}}}

// {"errors":[{"domain":"global",
  // "reason":"required",
  // "message":"Login Required","locationType":"header","location":"Authorization"}],"code":401,"message":"Login Required"}

module.exports = router

