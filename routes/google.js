var express = require('express');
var router = express.Router();
var passport = require('passport')

router.get('/auth',
  passport.authenticate('google', { session: false }));

router.get('/auth/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    req.session.access_token = req.user.accessToken;
    res.redirect('/');
  });

module.exports = router;
