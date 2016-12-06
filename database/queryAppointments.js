const knex = require('./knex')
const {
  firstRecord,
  createRecord,
  findRecord,
  updateRecord,
  deleteRecord} = require('./queryUtilities')

const createAppointment = attributes =>
  createRecord('appointments', attributes).then( appointment => appointment )

const findFirstAppointmentByCoachId = coach_id => 
  findRecord('appointments', 'coach_id', coach_id)
    .then( appointment => appointment )

const findFirstAppointmentByAttendee = attendee_sn => 
  knex
    .table("appointments")
    .where(knex.raw(`attendees @> '{${attendee_sn}}'::text[];`))
    .returning('*')
    .then(firstRecord)

const findAllAppointmentByCoachId = coach_id => 
  knex
    .table('appointments')
    .where('coach_id', coach_id)
    .returning('*')

const findAllAppointmentByAttendee = attendee_sn => 
  knex
    .table("appointments")
    .where(knex.raw(`attendees @> '{${attendee_sn}}'::text[];`))
    .returning('*')

const deleteAppointmentById = apt_id => 
  deleteRecord('appointments', 'id', apt_id)

module.exports = {
  createAppointment,
  findFirstAppointmentByAttendee,
  findFirstAppointmentByCoachId,
  findAllAppointmentByAttendee,
  findAllAppointmentByCoachId,
  deleteAppointmentById
}
