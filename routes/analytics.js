const express = require('express')
const router = express.Router()
const config = require('../config/config').readConfig()
const moment = require('moment-timezone')

const { analysisOfWeek } = require('../models/analytics')
const { findAllAppointmentsByDateRange } = require('../io/database/appointments')
const {
  getCycleByTeamId,
  getAllTeamsByCycle,
  getAllLearnersByCycle
} = require('../io/database/teams')

router.post('/', (request, response) => {
  const dateRange = request.body
  const analysisData = {}
  findAllAppointmentsByDateRange(dateRange)
    .then( appointments => {
      analysisData.appointments = appointments
      const id = appointments[0] ? appointments[0].team_id : 0
      return getCycleByTeamId(id)
    })
    .then( cycle => {
      return getAllTeamsByCycle(cycle)
    })
    .then( teams => {
      analysisData.teams = teams
      const cycle = teams[0] ? teams[0].cycle : 0
      return getAllLearnersByCycle(cycle)
    })
    .then( learners => {
      analysisData.learners = learners
      const analysis = analysisOfWeek( analysisData )
      response.json( analysis )
    })

})

module.exports = router
