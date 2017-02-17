const knex = require('./knex')
const { createRecord } = require('./utilities')

const associateLearnersWithTeams = teams =>
  Promise.all( teams.map( team => createRecord('learner-teams', team) ))

module.exports = { associateLearnersWithTeams }
