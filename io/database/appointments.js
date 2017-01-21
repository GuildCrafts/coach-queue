const knex = require('./knex')
const {
  firstRecord,
  createRecord,
  findRecord,
  updateRecord,
  deleteRecord} = require('./utilities')

const createAppointment = attributes =>
  createRecord('appointments', attributes).then( appointment => appointment )


const findFirstAppointmentByCoachId = coach_handle =>
  findRecord('appointments', 'coach_handle', coach_handle)
    .then( appointment => appointment )

const findFirstAppointmentByMenteeHandle = mentee_handle =>
  knex
    .table("appointments")
    .where(knex.raw(`mentee_handles @> '{${mentee_handle}}'::text[];`))
    .returning('*')
    .then(firstRecord)

const findAllAppointmentByCoachId = coach_handle =>
  knex
    .table('appointments')
    .where('coach_handle', coach_handle)
    .returning('*')

const findAllAppointmentByMenteeHandle = mentee_handle =>
  knex
    .table("appointments")
    .where(knex.raw(`mentee_handles @> '{${mentee_handle}}'::text[];`))
    .returning('*')
    .then( appointments => appointments )

const deleteAppointmentById = apt_id =>
  deleteRecord('appointments', 'id', apt_id)

const cancelAppointment = (appointment_id, isCanceled) =>
  updateRecord('appointments', 'id', appointment_id, isCanceled)

const findAppointmentById = appointment_id =>
  findRecord('appointments', 'id', appointment_id)

module.exports = {
  createAppointment,
  findFirstAppointmentByMenteeHandle,
  findFirstAppointmentByCoachId,
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId,
  deleteAppointmentById,
  cancelAppointment,
  findAppointmentById
}
