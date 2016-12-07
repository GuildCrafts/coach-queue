const knex = require('./knex')

const firstRecord = records => records[0]

const createRecord = (table, attributes) =>
  knex
    .table(table)
    .insert(attributes)
    .returning('*')
    .then(firstRecord)

const findRecord = (table, column, data) =>
  knex
    .table(table)
    .where(column, data)
    .returning('*')

const updateRecord = (table, column, data, attributes) =>
  knex
    .table(table)
    .where(column, data)
    .update(attributes)
    .returning('*')
    .then(firstRecord)

const deleteRecord = (table, column, data) =>
  knex
    .table(table)
    .where(column, data)
    .del()

//CRUD USERS
const createUser = attributes =>
  createRecord('users', attributes).then( user => user )

const findUserByLgId = lg_id => 
  findRecord('users', 'lg_id', lg_id).then(user => user)

const updateUserByLgId = (lg_id, attributes) => 
  updateRecord('users', 'lg_id', lg_id, attributes).then(user => user)

const deleteUserByLgId = lg_id =>
  deleteRecord('users', 'lg_id', lg_id)


//CRUD APPOINTMENTS
const createAppointment = attributes =>
  createRecord('appointments', attributes).then( appointment => appointment )

const findAllAppointmentByCoachId = coach_id => 
  findRecord('appointments', 'coach_id', coach_id)
    .then( appointment => appointment )

const findAppointmentByAttendee = attendee_sn => {

  findRecord('appointments', lg_id).then(appointment => appointment)
}

module.exports = {
  knex,
  createUser, 
  findUserByLgId,
  updateUserByLgId,
  deleteUserByLgId,
  createAppointment
}
