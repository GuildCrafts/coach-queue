const express = require( 'express' )
const router = express.Router()
const db = require( '../database/' )
const { Request, Event, Team } = db

router.get( '/', ( request, response ) => {
  if( request.user.is_coach ){
    response.redirect( '/coach' )
  } else {
    response.render( 'learner/index' )
  }
})

router.get( '/request', (request, response) =>
  Request.forTeam( request.user.id )
    .then( result => response.json( result ))
)

router.get( '/learner/coach', (request, response) => {
  Team.info( request.user.id )
    .then( result => response.json( result ))
})

module.exports = router
