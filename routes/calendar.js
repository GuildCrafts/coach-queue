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
    // let calendarId = Object.keys(data.calendars).toString()
    console.log(calendarId)
    console.log('haiiiiiii', data.calendars[calendarId].busy)
    const busyTimeMap = data.calendars[calendarId].busy.map( busyTime => {
      const busyTimeSlice = {
        start: busyTime.start,
        end: busyTime.end
      }
      return busyTimeSlice
    })
    console.log('busytiem', busyTimeMap)

    let dayStartTime = '9am'
    let dayEndTime = '5:30pm'
    let scheduleArray = []

    //day starts at 9am
    //find gcal first start time
    //create an object where day time is start and end time is gcal start
      //push that object to an scheduleArray
    //find gcal first end time
    //create an object where gcal end time is start and (either end of day 
            //or start of next appt) is end tiem
      //push that object to an scheduleArray

    //return scheduleArray

    // coachDay.reduce((current, accumulator) => {

    // }, [])

    return res.json(data);
  });
});

module.exports = router