const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')
const moment = require('moment')
const {getActiveCoaches} = require('../io/database/users')

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

    let busyTimeMap = data.calendars[calendarId].busy
    // console.log('busyTimeMap = ', busyTimeMap)
    console.log('your current moment is ', moment().seconds(30))

    let dayStartTime = '9am'
    let dayEndTime = '5:30pm'
    let currentTime = Date()

    let thing = busyTimeMap.reduce((freetimes, currentAppt) => {
      console.log('current!', currentAppt)
      console.log('--current apt.start: ', currentAppt.start, '--currentTime: ', currentTime)
      if(currentAppt.start >= currentTime) {
        freetimes.push({start:currentTime, end: currentAppt.start})
        currentTime = currentAppt.end
        console.log('freetimes ',freetimes)
        return freetimes
      } else if(!currentAppt){
        console.log('in not currentAppt')
        return freetimesfreetimes.push({start:currentTime, end: '6pm'})
      } else {
        console.log('final else')
        return current = currentAppt.end
      }
    }, [])

    console.log('FINAL THING =====>', thing)

    return res.json(data);
  });
});

module.exports = router