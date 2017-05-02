const db = require( '../db' )
const Player = require( '../players' )
const Request = require( '../requests' )
const decorate = require( './decorate' )

const RESET_CYCLE_STATISTICS = `DELETE FROM statistics WHERE cycle=$1`
const NEW_CYCLE_STATISTICS = `INSERT INTO statistics ( cycle ) VALUES ( $1 )`

const RESET_CYCLE_COACHES = `DELETE FROM coach_statistics WHERE cycle=$1`
const ADD_CYCLE_COACH = `
  INSERT INTO coach_statistics ( cycle, coach_id )
  VALUES ( $1, $2 )
`
const INITIALIZE = `
  UPDATE statistics SET
    longest_wait=$/longest_wait/,
    total_wait=$/total_wait/,
    total_claims=$/total_claims/,
    all_claimed_primary_claims=$/all_claimed_primary_claims/
  WHERE cycle=$/cycle/
`

const INITIALIZE_COACH = `
  UPDATE coach_statistics SET
    primary_claims=$/primary_claims/,
    claimed_primary_claims=$/claimed_primary_claims/,
    total_claims=$/total_claims/
  WHERE coach_id=$/id/ AND cycle=$/cycle/
`

const addCycleCoach = ( cycle, coach_id ) =>
  db.any( ADD_CYCLE_COACH, [ cycle, coach_id ])

const resetCycle = ( cycle, coaches ) =>
  db.any( RESET_CYCLE_STATISTICS, cycle )
    .then( _ => db.any( RESET_CYCLE_COACHES, cycle ))
    .then( _ => db.any( NEW_CYCLE_STATISTICS, cycle ))
    .then( _ => Promise.all(
      coaches.map( coach => addCycleCoach( cycle, coach.id ))
    ))

const initialize = data => db.any( INITIALIZE, data )

const initializeCoach = data => db.any( INITIALIZE_COACH, data )

const currentCycle = () =>
    db.any( 'SELECT MAX(cycle) FROM teams' )
      .then( cycle => cycle[ 0 ].max )

const getCycle = cycle => {
  if( cycle === 'current' ) {
    return currentCycle()
  } else {
    return Promise.resolve( cycle )
  }
}

const reset = cycleId => {
  return getCycle( cycleId )
    .then( cycle => Promise.all([
      cycle,
      Player.getCoaches( cycle )
    ]))
    .then( ([ cycle, coaches ]) =>
      Promise.all([
        cycle,
        coaches,
        Request.allInCycle( cycle ),
        resetCycle( cycle, coaches )
      ])
    )
}

const all = cycleId =>
  getCycle( cycleId )
    .then( cycle => Promise.all([
      db.one( 'SELECT * FROM statistics WHERE cycle=$1', [ cycle ]),
      db.any( 'SELECT * FROM coach_statistics JOIN players ON players.id=coach_statistics.coach_id WHERE cycle=$1', [ cycle ])
    ])).then( decorate )

const forCoach = coachHandle =>
  all( 'current' )
    .then( ({ statistics, coachStats }) =>
      coachStats.find( stat => stat.handle === coachHandle )
    )

module.exports = {
  resetCycle,
  addCycleCoach,
  initialize,
  initializeCoach,
  getCycle,
  currentCycle,
  reset,
  forCoach,
  all
}