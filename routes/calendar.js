const express = require('express')
const router = express.Router()
const _ = require('lodash')
const moment = require('moment')
const gcal = require('google-calendar')
const {createAppointment} = require('../io/database/appointments')
const {getActiveCoaches,
       updateUserByHandle} = require('../io/database/users')
const {getAllCoachesNextAppts} = require('../models/appointment')
const {extractCalendarIds,
       makeCalendarEvent} = require('../models/calendar') ;
const {ensureGoogleAuth} = require('../middleware')

const filterUnavailableCoaches = (coachesAppointmentData) => {
  return coachesAppointmentData.filter(
      (coachAppointmentData) => coachAppointmentData.earliestAppointment);
}

router.post('/find_next', (request, response) => {
  console.log("I need this ====>", request.body.pairs_github_handle)
  const requestingMenteeHandle = request.user.handle
  const pairsGuthubHandle = request.body.pairs_github_handle
  const access_token = request.session.access_token
  const currentTime = moment()

  getActiveCoaches()
    .then(coachesArray => {
      if (_.isEmpty(coachesArray)) {
        response.json({
          error: 'Could not book appointment',
          reason: 'There are no active coaches'
        })
      }
      return getAllCoachesNextAppts(coachesArray, currentTime)
    })
    .then(allCoachesNextAppointments => {
      // TODO: BUGFIX we're scheduling outside of business hours
      const coachesWithAvailableAppointments = filterUnavailableCoaches(allCoachesNextAppointments);
      const sortedAppointments = coachesWithAvailableAppointments.sort((a, b) =>
        a.earliestAppointment.start > b.earliestAppointment.start
      )

      if(sortedAppointments[0]) {
        let earliestApptData = sortedAppointments[0]
        let {calendarId, earliestAppointment, google_token} = earliestApptData
        let event = makeCalendarEvent(earliestAppointment.start, earliestAppointment.end, requestingMenteeHandle, pairsGuthubHandle)

        gcal(google_token).events.insert(calendarId, event, (error, data) =>
          error
            ? response.send(500, error)
            : createAppointment({
              appointment_start: data.start.dateTime,
              appointment_end: data.end.dateTime,
              coach_handle: earliestApptData.github_handle,
              appointment_length: 30,
              description: `Coaching Appointment with ${requestingMenteeHandle} & ${pairsGuthubHandle}.`,
              mentee_handles: [requestingMenteeHandle, pairsGuthubHandle]
            })
             .then(apptRecord => response.status(200).json(apptRecord))
        )
      } else {
        response.json({
          error: 'Could not schedule appointment!',
          reason: 'All coaches are booked'
        })
      }
    })
})

router.all('/', ensureGoogleAuth, (request, response) => {
  response.json({message: `on page /calendar. Authenticated with google with accessToken:${request.session.access_token}`});
})


module.exports = router
