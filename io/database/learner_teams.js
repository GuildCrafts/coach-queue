const knex = require('./knex')
const {
  createRecord
} = require('./utilities')

const addLearnerTeams = datas =>
  Promise.all( datas.map( data => createRecord('learner-teams', data) ))

module.exports = { addLearnerTeams }
