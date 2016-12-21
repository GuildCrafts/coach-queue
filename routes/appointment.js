const express = require('express')
const router = express.Router()
const rp = require('request-promise')

const { findFirstAppointment } = require('../models/appointment')
const {
  createAppointment, 
  findActiveCoaches
} = require('../io/database/appointments')

router.get('/', (request, response)  => {
  //getting these from chat
  let { 
    appointment_length, 
    description, 
    attendees
  } = request.params
  

  let date = findFirstAppointment(activeCoaches, appointment_length)

  let appointmentData = {
    coach_handle: coach_handle,
    date_time: date,
    appointment_length: appointment_length,
    description: description,
    attendees: attendees
  }

  createAppointment(appointmentData)
    .then( apptDetails => response.json({apptDetails}))
})


router.get('/feedback', (request, response, next) =>{
  var options = {
    uri: 'https://api.typeform.com/v1/form/jWG4Fo',
    qs: {
      key: '89cf37a725f924ce42131e0aa7523822ca885d30' // -> uri + '?access_token=xxxxx%20xxxxx' 
    },
    headers: {'User-Agent': 'Request-Promise'},
    json: true 
  };
 
  rp(options)
    .then(responses => {
        console.log('Did I get anything?', responses.responses[0].answers);
    })
    .catch(error => console.log(error))
})

module.exports = router
