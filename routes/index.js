const express = require( 'express' )
const router = express.Router()

router.get( '/', ( request, response ) => {
  // Determine if current authenticated user is a coach
  // and redirect if true
  const isCoach = false
  if( isCoach ) {
    response.redirect( '/coach' )
  }

  response.render( 'learner/index', { user_id: request.user.id })
})

router.get( '/coach', ( request, response ) => {
  // Determine if current authenticated user is a coach
  // redirect if false
  const isCoach = true
  if( ! isCoach ) {
    response.redirect( '/' )
  }

  response.render( 'coach/index', { user_id: request.user.id })
})

module.exports = router
