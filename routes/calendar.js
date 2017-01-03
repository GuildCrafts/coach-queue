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

router.all('/find_next', (request, response) => {
  // const requestingMenteeHandle = request.user.handle
  // const secondMenteeHandle = request.params.handle
  console.log('entered find_next handler');
  console.log('request.user', request.user)
  const access_token = request.session.access_token
  const currentTime = moment()
  getActiveCoaches()
    .then(coachesArray => {
      if (_.isEmpty(coachesArray)) {
        response.json({message: 'Could not book appointment',
                       reason: 'There are no active coaches'})
      }
      return getAllCoachesNextAppts(coachesArray, currentTime)
    })
    .then(allCoachesNextAppointments => {
      // TODO: we seem to be going past the time ranges to find appt, fix the bug
      // TODO: events are created with overlap?! maybe it is not finding the
      // newly created events when you check for busytimes in the next request
      const coachesWithAvailableAppointments = filterUnavailableCoaches(allCoachesNextAppointments);
      const sortedAppointments = coachesWithAvailableAppointments.sort((a, b) =>
        a.earliestAppointment.start > b.earliestAppointment.start
      )
      console.log('sortedAppointments', sortedAppointments)
      if(sortedAppointments[0]) {
        let earliestApptData = sortedAppointments[0]
        let {calendarId, earliestAppointment, google_token} = earliestApptData
        console.log('earliest Appointment Start: ', earliestAppointment.start)
        console.log('calendarId', calendarId)
        console.log('$$ appt::', earliestAppointment);
        let event = makeCalendarEvent(earliestAppointment.start, earliestAppointment.end);
        gcal(google_token).events.insert(calendarId, event, (error, data) =>
                                         error
                                         ? response.send(500, error)
                                         : createAppointment({
                                             appointment_start: data.start.dateTime,
                                             appointment_end: data.end.dateTime,
                                             coach_handle: earliestApptData.github_handle,
                                             appointment_length: 30,
                                             description: 'Please help.',
                                             mentee_handles: [ 'someone', 'a-person', 'humansLoveCode' ]
                                         })
                                         .then(apptRecord => response.json(apptRecord))
                                        )
      } else {
        response.json({message: 'Could not schedule appointment!',
                       reason: 'All coaches are booked out'});
      }
    })
})

//YOU WILL BE FORCED TO LOG IN TO GCAL ACCESS ANY OF THESE ROUTES
router.use(ensureGoogleAuth)

router.all('/', (request, response) => {
  const {access_token, github_handle} = request.session
  gcal(access_token).calendarList.list((error, calendarList) => {
    if (error) {
      return response.send(500, error)
    } else {
      // TODO use radio buttons to choose which calendar to work with
      updateUserByHandle(github_handle,
                         {calendar_ids: extractCalendarIds(calendarList)})
        .then(() => response.json(calendarList));
    }
  })
})


module.exports = router
