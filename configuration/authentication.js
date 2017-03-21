const {
  addUserToRequestFromJWT
} = require('@learnersguild/idm-jwt-auth/lib/middlewares')
const { IDM_BASE_URL, BASE_URL } = process.env

const init = function( app ) {
  app.use( addUserToRequestFromJWT )
  app.use(( request, response, next ) => {
    if ( request.user === undefined ) {
      return response.redirect(
        `${IDM_BASE_URL}/sign-in?redirect=${BASE_URL}`
      )
    }
    next()
  })
}

module.exports = { init }
