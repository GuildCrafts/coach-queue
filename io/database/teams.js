const knex = require('./knex')
const { createRecord } = require('./utilities')

const addTeams = teams =>
  Promise.all( teams.map( team => createRecord('teams', team) ))

module.exports = { addTeams }
