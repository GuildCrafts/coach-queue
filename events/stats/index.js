const io = require( '../socketio/' )
const { Statistics } = require( '../../database' )

const calculateStatistics = require( '../../lib/statistics/calculate' )

const calculate = () => {
  Statistics.reset( 'current' )
    .then( calculateStatistics )
    .then( result => Promise.all([
      result,
      Statistics.initialize( result.statistics ),
      ...Object.keys( result.coachStats ).map( id =>
        Statistics.initializeCoach( result.coachStats[ id ])
      )
    ]))
    .then( _ => Statistics.all( 'current' ))
    .then( statistics => io.to( '/stats' ).emit( 'update', statistics ))
}

module.exports = calculate