const express = require( 'express' )
const router = express.Router()
const io = require( '../../events/socketio/' )

const db = require( '../../database/' )
const { Statistics, Event, Player, Request } = db

const calculate = require( '../../lib/statistics/calculate' )

router.get( '/', ( request, response ) => {
  response.render( 'stats/index' )
})

router.get( '/:cycle', ( request, response ) => {
  const { cycle } = request.params

  Statistics.all( cycle )
    .then( result => response.json( result ))
})

router.post( '/calculate/:cycle', ( request, response ) => {
  return Statistics.reset( request.params.cycle )
    .then( calculate )
    .then( result => Promise.all([
      result,
      Statistics.initialize( result.statistics ),
      ...Object.keys( result.coachStats ).map( id =>
        Statistics.initializeCoach( result.coachStats[ id ])
      )
    ]))
    .then( _ => Statistics.all( request.params.cycle ))
    .then( statistics => io.to( '/stats' ).emit( 'update', statistics ))
})

module.exports = router
