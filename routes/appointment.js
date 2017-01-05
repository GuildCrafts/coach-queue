const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const gcal = require('google-calendar')
const moment = require('moment')

const {getActiveCoaches} = require('../io/database/users')
const {
  getAllCoachesNextAppts,
  findNextAppointment,
  apptData,
  calendarEvent
} = require('../models/appointment')

const {
  createAppointment,
  findActiveCoaches,
  findAllAppointmentByMenteeHandle
} = require('../io/database/appointments')

router.post('/mentee-schedule', (request, response) => {
  const {currentUserHandle} = request.body

  findAllAppointmentByMenteeHandle(currentUserHandle)
    .then(appointments => {
      console.log('Mentee appointment', appointments)
      response.json(appointments)
    })
})

router.post('/create', (request, response) => {
  const {currentUserHandle, pairs_github_handle} = request.body

  getActiveCoaches()
    .then(activeCoaches => getAllCoachesNextAppts(activeCoaches))
    .then(availableTimes => {
      const appointment = findNextAppointment(availableTimes)
      const appointmentData = apptData(
        appointment.github_handle,
        [currentUserHandle, pairs_github_handle],
        appointment.start,
        appointment.end
      )

      const event = calendarEvent(
        currentUserHandle,
        pairs_github_handle,
        appointment.start,
        appointment.end
      )

      gcal(appointment.google_token).events
        .insert(appointment.calendarId, event, (error, data) => {
          if (error) {
            response.status(500).json(null)
          } else {
            createAppointment(appointmentData)
              .then(apptDetails => response.status(200).json(apptDetails))
          }
        })
    })
    .catch(() => response.status(401).json(null))
})


router.get('/feedback', (request, response, next) =>{
  const options = {
    uri: 'https://api.typeform.com/v1/form/jWG4Fo',
    qs: {
      key: '89cf37a725f924ce42131e0aa7523822ca885d30' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {'User-Agent': 'Request-Promise'},
    json: true
  }

  rp(options)
    .then(responses =>
      console.log('Did I get anything?', responses.responses[0].answers)
    )
    .catch(error => console.log(error))
})

module.exports = router
