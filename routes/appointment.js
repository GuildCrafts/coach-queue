const express = require('express')
const router = express.Router()
const {createAppointment} = require('../io/database/appointments')

router.get('/', (req, res, next)  => {
  let fakeappt = {
    coach_id:'4321cd',
    date_time: new Date(2017, 1, 27, 16, 5),
    appointment_length: 45,
    description: "Something here now.",
    attendees: ['someone_123', 'aNameIsCool', 'peopleLikeLearning']
  }

  createAppointment(fakeappt)
    .then( apptDetails => res.json({apptDetails}))
})

module.exports = router