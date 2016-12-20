var express = require('express');
var router = express.Router();
var passport = require('passport')

router.get('/auth',
  passport.authenticate('google', { session: false }));

router.get('/auth/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    req.session.access_token = req.user.accessToken;
    // checks for that created user
    // update with token
    res.redirect('/');
  });

module.exports = router;
