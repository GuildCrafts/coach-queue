const knex = require('./knex')

const firstRecord = records => records[0]

const createRecord = (table, attributes) =>
  knex
    .table(table)
    .insert(attributes)
    .returning('*')
    .then(firstRecord)

const findRecordByLgId = (table, attributes) =>
  knex
    .table(table)
    .where('lg_id', attributes)
    .first('*')

const updateRecordbyLgId = (table, lg_id, attributes) =>
  knex
    .table(table)
    .where('lg_id', lg_id)
    .update(attributes)
    .returning('*')
    .then(firstRecord)

const deleteRecordbyLgId = (table, lg_id) =>
  knex
    .table(table)
    .where('lg_id', lg_id)
    .del()

const createUser = attributes =>
  createRecord('users', attributes).then( user => user )

const findUser = lg_id => 
  findRecordByLgId('users', lg_id).then(user => user)

const updateUser = (lg_id, attributes) => 
  updateRecordbyLgId('users', lg_id, attributes).then(user => user)

const deleteUser = lg_id =>
  deleteRecordbyLgId('users', lg_id)

const createAppointment = attributes =>
  createRecord('appointments', attributes).then( appointment => appointment )

module.exports = {
  knex,
  createUser, 
  findUser,
  updateUser,
  deleteUser
}
