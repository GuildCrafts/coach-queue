const knex = require('./knex')
const {
  firstRecord,
  createRecord,
  findRecord,
  updateRecord,
  deleteRecord
} = require('./utilities')

const moment = require('moment-timezone')

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

const findAllAppointmentsByWeek = weekDate => {
  const startOfWeek = moment( weekDate ).startOf( 'week' ).add({ d: 1, h: 8 })
  const endOfWeek = startOfWeek.clone().startOf( 'week' ).add({ d: 5, h: 18 })
  return knex
    .table( 'appointments' )
    .whereBetween( 'created_at_timestamp', [ startOfWeek, endOfWeek ] )
    .returning( '*' )
    .orderBy( 'coach_handle', 'asc' )
}

module.exports = {
  createAppointment,
  findFirstAppointmentByMenteeHandle,
  findFirstAppointmentByCoachId,
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId,
  deleteAppointmentById,
  cancelAppointment,
  findAppointmentById,
  findAllAppointmentsByWeek,
}
