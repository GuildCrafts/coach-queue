const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')

const {
  getGCalSchedule, 
  findFreeSchedule
} = require('../models/appointment')

router.all('/', (req, res) => {
  const accessToken = req.session.access_token

  gcal(accessToken).calendarList.list((err, data) => 
    err ? res.send(500,err) : res.json(data)
  )
})

router.all('/:calendarId', (req, res) => {
  const {access_token} = req.session;
  const {calendarId} = req.params;

  gcal(access_token).freebusy.query( 
  { 
    items: [{id:`${calendarId}`}],
    timeMin: new Date(), 
    timeMax: new Date("2016-12-20"),
    timezone: 'America/Los_Angeles'
  }, (err, data) => {
    if (err) { return res.send(500,err) }

    let busyTime = data.calendars[calendarId].busy
    console.log(busyTime)

    Promise.resolve(findFreeSchedule(busyTime))
      .then(freeApptTimes => res.json(freeApptTimes))
      .catch(err => res.json(err))
  });
});

module.exports = router