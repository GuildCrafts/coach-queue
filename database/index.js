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
    ])
  )

module.exports = {
  Request: require( './requests/' ),
  Event: require( './events/' ),
  Admin: require( './admin' ),
  reset: process.env.NODE_ENV === 'test' ? reset : (() => {})
}