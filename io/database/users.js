const knex = require('./knex')
const {
  createRecord,
  findRecord,
  updateRecord,
  deleteRecord,
  findAllRecords} = require('./utilities')

const createUser = attributes =>
  createRecord('users', attributes).then( user => user )

const findUserByLgId = lg_id => 
  findRecord('users', 'lg_id', lg_id).then(user => user)

const updateUserByLgId = (lg_id, attributes) => 
  updateRecord('users', 'lg_id', lg_id, attributes).then(user => user)

const deleteUserByLgId = lg_id =>
  deleteRecord('users', 'lg_id', lg_id)

const getActiveCoaches = () => 
  findAllRecords('users', 'active_coach', true).then(user => user)

const activateCoach = (github_handle) => 
  updateRecord('users', 'github_handle', github_handle, {active_coach: true})

const deactivateCoach = (github_handle) => 
  updateRecord('users', 'github_handle', github_handle, {active_coach: false})

module.exports = {
  knex,
  createUser, 
  findUserByLgId,
  updateUserByLgId,
  deleteUserByLgId,
  getActiveCoaches,
  activateCoach,
  deactivateCoach
}
