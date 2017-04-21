const knex = require('./knex')

const reset = () =>
  knex.migrate.latest().then( () =>
    Promise.all([
      knex.truncate('events'),
      knex.truncate('requests'),
      knex.truncate('teams'),
      knex.truncate('team_players'),
      knex.truncate('players'),
      knex.truncate('goals'),
      knex.truncate('goal_coaches'),
      knex.truncate('statistics'),
      knex.truncate('coach_statistics')
    ])
  )

module.exports = {
  Request: require( './requests/' ),
  Event: require( './events/' ),
  Admin: require( './admin' ),
  Team: require( './teams' ),
  Player: require( './players' ),
  Goal: require( './goals' ),
  Statistics: require( './statistics' ),
  reset: process.env.NODE_ENV === 'test' ? reset : (() => {})
}