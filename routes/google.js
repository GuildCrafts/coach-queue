var express = require('express');
var router = express.Router();
var passport = require('passport')
const {updateUserByHandle} = require('../io/database/users')

router.get('/auth',
  passport.authenticate('google', { session: false }));

router.get('/auth/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    req.session.access_token = req.user.accessToken;
    const {access_token, github_handle} = req.session

    if(github_handle){
      updateUserByHandle(github_handle, {google_token: access_token})
    }
    res.redirect('/');
  });

module.exports = router;
