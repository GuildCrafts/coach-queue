const express = require('express')
const router = express.Router()
const passport = require('passport')
const {updateUserByHandle} = require('../io/database/users')

router.get('/auth',
  passport.authenticate('google', { session: false }))

router.get('/auth/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (request, response) => {
    request.session.access_token = request.user.accessToken
    const {access_token, github_handle} = request.session
    console.log('hit auth/callback, here\'s the access token:', access_token)
    console.log('the session info: ',request.session)
    // TODO access token not being updated when you relogin into google
    if(github_handle) {
      updateUserByHandle(github_handle, {google_token: access_token})
    } else {
      response.redirect('/')
    }
  })

module.exports = router
