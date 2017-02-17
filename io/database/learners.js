const knex = require('./knex')
const { createRecord } = require('./utilities')

const addLearners = handles =>
  Promise.all( handles.map( handle => createRecord('learners', handle) ))

module.exports = { addLearners }
