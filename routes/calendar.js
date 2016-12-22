const express = require('express')
const router = express.Router()
const moment = require('moment')
const gcal = require('google-calendar')
const rp = require('request-promise')
const {createAppointment} = require('../io/database/appointments')
const {
  findFreeSchedule,
  findNextAppointment,
  getAllCoachesNextAppts} = require('../models/appointment')
const {
  getActiveCoaches,
  findUserByHandle,
  createUser,
  updateUserByHandle} = require('../io/database/users')

//YOU WILL BE FORCED TO LOG IN TO GCAL ACCESS ANY OF THESE ROUTES

router.all('/', (request, response) => {
  const {access_token} = request.session
  const github_handle = request.user.handle

  gcal(access_token).calendarList.list((error, calendarList) => {
    if (error) {
      return response.send(500, error)
    } else {
      // use radio buttons to choose which calendar to work with
      // updateUserByHandle(github_handle, {email: gCalEmail})
      response.json(calendarList)
    }
  })
})

router.all('/active', (request, response) => {
  // const github_handle = request.user.handle // When we're live with IDM
  const github_handle = request.params.githubHandle
  request.session.github_handle = github_handle
  const {access_token} = request.session

  findUserByHandle(github_handle).then(user => {
    if (user && user.email !== null) {
      updateUserByHandle(github_handle, {google_token: access_token})
        .then(response.json(user))
    
    } else if (user && user.email === null) {
      response.redirect('/calendar')
    
    } else {
      createUser({
        github_handle,
        active_coach: false,
        google_token: access_token,
      })
      .then((data) => response.json('/calendar'))
    }
  })
  .catch(error => console.error(error))
})

router.all('/find_next', (request, response) => {
  const requestingMenteeHandle = request.user.handle
  const secondMenteeHandle = request.params.handle
  const access_token = request.session.access_token

  getActiveCoaches()
    .then(coachesArray => getAllCoachesNextAppts(coachesArray, access_token))
      .then(allCoachesNextAppointments => {
        // TODO: we seem to be going past the time ranges to find appt, fix the bug
        // TODO: events are created with overlap?! maybe it is not finding the
          // newly created events when you check for busytimes in the next request
        const sortedAppointments = allCoachesNextAppointments.sort((a, b) =>
          a.earliestAppointment.start > b.earliestAppointment.start
        )
        let earliestApptData = sortedAppointments[0]
        let {calendarId, earliestAppointment} = earliestApptData
        console.log('earliest Appointment Start: ', earliestAppointment.start)

        let event = {
          'summary': `Coaching session with ${requestingMenteeHandle}`,
          'description': 'Go get \'em champ',
          'start': {
            'dateTime': earliestAppointment.start.toDate(),
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': earliestAppointment.end.toDate(),
            'timeZone': 'America/Los_Angeles'
          }
        }

        gcal(access_token).events.insert(calendarId, event, (error, data) =>
          error
          ? res.send(500, error)
          : createAppointment({
            appointment_start: data.start.dateTime,
            appointment_end: data.end.dateTime,
            coach_handle: earliestApptData.github_handle,
            appointment_length: 30,
            description: 'Please help.',
            mentee_handles: [ requestingMenteeHandle, secondMenteeHandle ]
          })
          .then(apptRecord => response.json(apptRecord))
        )
      })
})

module.exports = router
