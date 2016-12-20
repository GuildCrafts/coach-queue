const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')
const moment = require('moment')
const {findFreeSchedule, findNextAppointment} = require('../models/appointment')
const {createAppointment} = require('../io/database/appointments')
const {getActiveCoaches} = require('../io/database/users')

router.all('/', (req, res) => {
  const {accessToken} = req.session

  gcal(accessToken).calendarList.list((err, data) =>
    err ? res.send(500,err) : res.json(data)
  )
})

router.all('/find_next', (request, response) => {
  //TODO: make sure email and calendar id's fields in DB are filled in on 'onboarding'
  const startOfToday = moment().startOf('day').add({h:9})
  const endOfToday = moment().startOf('day').add({h:17.5})

  let endOfDay = moment() > endOfToday
    ? moment().endOf('day').add({h:17.5, ms:1})
    : endOfToday

  let startOfDay = moment().isBetween(endOfToday, moment().endOf('day'))
    ? moment().endOf('day').add({h:9, ms:1})
    : startOfToday
    
  getActiveCoaches()
    .then(coachesArray => {
      return coachesArray.map(coach => {
        console.log(coach)
        const access_token = coach.google_token
        const google_calendar = gcal(access_token)
        const calendarId = coach.calendar_ids[0]

        google_calendar.freebusy.query({
          items: [{id:`${calendarId}`}],
          timeMin: startOfDay,
          timeMax: endOfDay
        }, (error, data) => {
          if (error) response.status(500).json(error)
          const busyTime = data.calendars[calendarId].busy
          return Promise.resolve(findFreeSchedule(busyTime))
            .then(freeApptTimes => {
              console.log('times from promise', freeApptTimes)
              return {freeApptTimes, user: calendarId}
            })
        })
      })
    })
    .then(times => console.log('RESPONSE Times', times))
})


router.all('/:calendarId', (req, res) => {
  const { access_token } = req.session;
  const google_calendar = gcal(access_token)
  const { calendarId } = req.params;
  const endOfToday = moment().startOf('day').add({h:17.5})
  const startOfToday = moment().startOf('day').add({h:9})

  let endOfDay = moment() > endOfToday
    ? moment().endOf('day').add({h:17.5, ms:1})
    : endOfToday

  let startOfDay = moment().isBetween(endOfToday, moment().endOf('day'))
    ? moment().endOf('day').add({h:9, ms:1})
    : startOfToday


  google_calendar.freebusy.query({
    items: [{id:`${calendarId}`}],
    timeMin: startOfDay,
    timeMax: endOfDay
  }, (err, data) => {
    if (err) { return res.send(500, err) }

    let busyTime = data.calendars[calendarId].busy
    console.log(busyTime)
    Promise.resolve(findFreeSchedule(busyTime))
      .then(freeApptTimes => findNextAppointment(freeApptTimes))
      .then( aptData => {
        let aptStart = aptData.start
        let aptEnd = aptData.end
        let event = {
          'summary': 'Coaching session with Somebody',
          'description': 'Go get \'em champ',
          'start': {
            'dateTime': aptStart,
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': aptEnd,
            'timeZone': 'America/Los_Angeles'
          }
        }
        google_calendar.events.insert(calendarId, event, (err, data) => {
          if (err) { return res.send(500, err) }
          createAppointment({
            appointment_start: data.start.dateTime,
            appointment_end: data.end.dateTime,
            coach_handle: 'imaleafyplant',
            appointment_length: 30,
            description: 'Please help.',
            mentee_handles: [ 'luvlearning', 'cupofjoe', 'codeandstuff' ]
          }).then(databaseData => res.json(databaseData))
      }).catch(err => res.json(err))
    })
  })
})

module.exports = router
