const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')
const moment = require('moment')


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
  const thisFriday = moment().startOf('week').add({days:5, hours: 17.5})

  gcal(access_token).freebusy.query( 
  { 
    items: [{id:`${calendarId}`}],
    timeMin: moment(), 
    timeMax: thisFriday,
    timezone: 'America/Los_Angeles'
  }, (err, data) => {
    if (err) { return res.send(500,err) }

    let busyTime = data.calendars[calendarId].busy
    console.log('here\'s your busy time:: ',busyTime)

    Promise.resolve(findFreeSchedule(busyTime))
      .then(freeApptTimes => {
        //findFirstApt(freeApptTimes)
        return res.json(freeApptTimes)
      })
      .catch(err => res.json(err))
  });
});

module.exports = router