const express = require('express')
const router = express.Router()
const config = require('../config/config').readConfig()
const moment = require('moment-timezone')

const { analysisOfWeek } = require('../models/analytics')
const { findAllAppointmentsByWeek } = require('../io/database/appointments')

router.get('/', (request, response) => {
  const week = moment()
  findAllAppointmentsByWeek(week)
    .then( weeklyAppointments => {
      const analysis = analysisOfWeek( weeklyAppointments )
      response.json( analysis )
    })
})

module.exports = router
