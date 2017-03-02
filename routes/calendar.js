const express = require('express')
const router = express.Router()
const _ = require('lodash')
const moment = require('moment-timezone')
const gcal = require('google-calendar')

const {
  createAppointment,
  findAppointmentById,
  canScheduleAppointment
} = require('../io/database/appointments')

const {
  getActiveCoaches,
  updateUserByHandle,
  findUserByHandle
} = require('../io/database/users')

const {
  getAllCoachesNextAppts,
  requester,
  findCoach,
  cancelAppointmentHelper
} = require('../models/appointment')

const {
  extractCalendarIds,
  makeCalendarEvent
} = require('../models/calendar')

const {ensureGoogleAuth} = require('../middleware')

const findAvailableCoaches = coachesAppointmentData =>
  new Promise( (resolve, reject) => {
    resolve( coachesAppointmentData.filter( data => data.earliestAppointment ) )
  })

const sortAvailableCoaches = appointments =>
  new Promise( (resolve, reject) => {
    resolve( appointments.sort( (a, b) =>
      a.earliestAppointment.start > b.earliestAppointment.start
    ))
  })

router.post('/find_next', (request, response) => {
  const mentee = requester(request)

  canScheduleAppointment( mentee )
    .then( canSchedule => {
      if( ! canSchedule ) {
        return Promise.reject({ reason: 'You currently have an appointment scheduled.' })
      }
    })
    .then( getActiveCoaches )
    .then( coaches => {
      if( _.isEmpty( coaches )) {
        return Promise.reject({ reason: 'There are no active coaches.' })
      } else {
        return getAllCoachesNextAppts( coaches, moment().tz('America/Los_Angeles') )
      }
    })
    .then( findAvailableCoaches )
    .then( sortAvailableCoaches )
    .then( scheduleAppointment( mentee, request.body.pairs_github_handle ))
    .then( appointment => response.status( 200 ).json( appointment ))
    .catch( error => {
      console.log( error )
      response.json( Object.assign( {}, error, { error: 'Could not book appointment.' }))
    })
})

const scheduleWithGcal = ( token, id, event, sortedAppointments, mentee, pair ) =>
  new Promise( (resolve, reject ) => {
    const { calendarId, earliestAppointment, google_token, github_handle: coach_handle } = sortedAppointments[ 0 ]
    const { start, end } = earliestAppointment

    const event = makeCalendarEvent( start, end, mentee, pair )

    gcal( token ).events.insert( id, event, (error, data) => {
      if( error ) {
        reject({ reason: error, google_token, calendarId })
      } else {
        createAppointment({
          appointment_start: data.start.dateTime,
          appointment_end: data.end.dateTime,
          coach_handle,
          appointment_length: 30,
          description: `Coaching Appointment with ${mentee} & ${pair}.`,
          mentee_handles: [ mentee, pair ],
          event_id: data.id
        }).then( result => resolve( result ))
      }
    })
  })


const scheduleAppointment = (mentee, pair) => sortedAppointments => {
  if( sortedAppointments[ 0 ] === undefined ) {
    Promise.reject({ reason: 'All coaches are booked.' })
  } else {
    const { calendarId, earliestAppointment, google_token, github_handle: coach_handle } = sortedAppointments[ 0 ]
    const { start, end } = earliestAppointment

    const event = makeCalendarEvent( start, end, mentee, pair )

    return scheduleWithGcal( google_token, calendarId, event, sortedAppointments, mentee, pair )
  }
}

router.all('/', ensureGoogleAuth, (request, response) => {
  response.json({message: `on page /calendar. Authenticated with google with accessToken:${request.session.access_token}`});
})

router.get('/test/:github_handle', (request, response) => {
    console.log('request.params.github_handle', request.params.github_handle)
  findUserByHandle(request.params.github_handle)
    .then(user => {
      console.log('user::', user);
      gcal(user.google_token).calendarList.list((error, calendarListResp) => {
        if (error) {
          response.send(500, error)
        } else {
          response.json(calendarListResp)
        }
    })
  })
})

router.post('/cancel_appointment', (request, response) => {
  const {appointment_id} = request.body

  findAppointmentById(request.body.appointment_id)
    .then(findCoach(request))
    .then(cancelAppointmentHelper(response, request, appointment_id))
})


module.exports = router
