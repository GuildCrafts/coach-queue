const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')
const moment = require('moment')
const { findFreeSchedule } = require('../models/appointment')

router.all('/', (req, res) => {
  const accessToken = req.session.access_token

  gcal(accessToken).calendarList.list((err, data) => 
    err ? res.send(500,err) : res.json(data)
  )
})

router.all('/:calendarId', (req, res) => {
  const { access_token } = req.session;
  const { calendarId } = req.params;
  const endOfToday = moment().startOf('day').add({h:17.5})

  let endOfDay = (moment() < endOfToday) 
    ? endOfToday
    : moment().endOf('day').add({h:17.5, ms:1})

  gcal(access_token).freebusy.query( 
  { 
    items: [{id:`${calendarId}`}],
    timeMin: moment(), 
    timeMax: endOfDay
  }, (err, data) => {
    if (err) { return res.send(500, err) }

    let busyTime = data.calendars[calendarId].busy

    Promise.resolve(findFreeSchedule(busyTime))
      .then(freeApptTimes => res.json(freeApptTimes))
      .catch(err => res.json(err))
  })
})

module.exports = router