const express = require( 'express' )
const router = express.Router()
const db = require( '../database/' )
const { Request, Event, Player } = db

router.get( '/', ( request, response ) => {
  // Determine if current authenticated user is a coach
  // and redirect if true
  if( request.user.is_coach ){
    response.redirect('/coach')
  } else {
    Request.forTeam( request.user.id )
      .then( request => response.render( 'learner/index', { request }) )
      .catch( error => response.json({ error, message: error.message }) )
  }
})

module.exports = router
