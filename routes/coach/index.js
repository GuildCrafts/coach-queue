const express = require( 'express' )
const router = express.Router()

const db = require( '../../database/' )
const { Team, Request, Statistics } = db

router.get( '/', ( request, response ) => {
  response.render( 'coach/index' )
})

router.get( '/teams', (request, response) => {
  Statistics.currentCycle()
    .then( cycle => Team.forCoach( request.user.id, cycle ))
    .then( result => response.json( result ))
})

router.get( '/requests', (request, response) => {
  Request.all().then( requests => response.json( requests ))
})

router.get( '/whoami', (request, response) => {
  response.json( request.user.id )
})

module.exports = router
