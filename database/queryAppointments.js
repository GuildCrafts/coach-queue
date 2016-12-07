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


module.exports = {
  createAppointment,
  findFirstAppointmentByAttendee,
  findFirstAppointmentByCoachId
}