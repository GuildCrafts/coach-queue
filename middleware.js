const ensureGoogleAuth = (req, res, next) => {
  if (req.session && req.session.access_token) {
    next()
  } else {
    req.session.redirectTo = req.originalUrl
    return res.redirect('/google/auth')
  }
};

module.exports = {ensureGoogleAuth};
