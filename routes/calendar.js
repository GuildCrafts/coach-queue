const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')
const {getActiveCoaches} = require('../io/database/users')

router.all('/', (req, res) => {
  var accessToken = req.session.access_token

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
    timeMax: new Date("2016-12-20")
  }, (err, data) => {
    // if (err) return res.send(500,err)
    let calendarId = Object.keys(data.calendars).toString()
    const busyTimeMap = data.calendars[calendarId].busy

    let dayStartTime = '9am'
    let dayEndTime = '5:30pm'
    let scheduleArray = []

    // [ { end: '2016-12-15T18:00:00Z', start: '2016-12-15T19:00:00Z' } ]

    // [{start:dayStartTime, end:busyTimeMap[0].end},
    //   {start:busyTimeMap[0].start, end:dayEndTime}]


    // coachDay.reduce((current, accumulator) => {

    // }, [])

    return res.json(data);
  });
});

module.exports = router