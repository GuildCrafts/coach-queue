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
  createRecord('appointments', attributes)

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

const findAllAppointmentsByDateRange = ({ startDate, endDate }) => {
  return knex
    .table( 'appointments' )
    .where( 'appointment_start', '>=', startDate )
    .andWhere( 'appointment_start', '<=', endDate )
    .andWhere( 'is_canceled', false )
    .returning( '*' )
    .orderBy( 'coach_handle', 'asc' )
}

const deleteAllAppointments = () =>
  knex.raw(`DELETE FROM appointments;`)

const canScheduleAppointment = mentee_handle =>
  knex.raw(`SELECT COUNT(*)
    FROM appointments
    WHERE appointment_end > now()
    AND mentee_handles @> '{${mentee_handle}}'::text[]`
  ).then( results => results.rows[ 0 ].count === '0' )

module.exports = {
  createAppointment,
  findFirstAppointmentByMenteeHandle,
  findFirstAppointmentByCoachId,
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId,
  deleteAppointmentById,
  cancelAppointment,
  findAppointmentById,
  findAllAppointmentsByDateRange,
  deleteAllAppointments,
  canScheduleAppointment
}
