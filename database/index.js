const knex = require('./knex')

const reset = () =>
  knex.migrate.latest().then( () =>
    Promise.all([
      knex.truncate('events'),
      knex.truncate('requests'),
      knex.truncate('teams'),
      knex.truncate('team_players'),
      knex.truncate('players'),
      knex.truncate('projects'),
      knex.truncate('project_coaches'),
    ])
  )

module.exports = {
  Request: require( './requests/' ),
  Event: require( './events/' ),
  reset: process.env.NODE_ENV === 'test' ? reset : (() => {})
}