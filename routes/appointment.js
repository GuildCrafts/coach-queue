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
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId
} = require('../io/database/appointments')

router.get('/coach-schedule', (request, response) => {
  const coach_handle = request.idmUser.handle

  findAllAppointmentByCoachId(coach_handle)
    .then(appointments => {
      console.log('Coach Appointments', appointments);
      response.json(appointments)
  })
})

router.post('/mentee-schedule', (request, response) => {
  const currentUserHandle = request.idmUser.handle

  findAllAppointmentByMenteeHandle(currentUserHandle)
    .then(appointments => {
      console.log('Mentee appointment!!', appointments)
      response.json(appointments)
    })
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
