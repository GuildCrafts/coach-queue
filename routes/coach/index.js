const express = require( 'express' )
const router = express.Router()

const db = require( '../../database/' )
const { Team } = db

const { getRequests } = require( './data' )

router.get( '/', ( request, response ) => {
  response.render( 'coach/index' )
})

router.get( '/teams', (request, response) => {
  Team.forCoach( request.user.id )
    .then( result => response.json( result ))
})

router.get( '/requests', (request, response) => {
  getRequests().then( requests => response.json( requests ))
})

module.exports = router
