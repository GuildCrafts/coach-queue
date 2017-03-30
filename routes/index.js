const express = require( 'express' )
const router = express.Router()
const db = require( '../database/' )
const { Request, Event } = db

router.get( '/', ( request, response ) => {
  // Determine if current authenticated user is a coach
  // and redirect if true
  const isCoach = false
  if( isCoach ) {
    response.redirect( '/coach' )
  }

  Request.forTeam( request.user.id )
    .then( request => response.render( 'learner/index', { request }))
    .catch( error => response.json({ error, message: error.message }))
})

module.exports = router
