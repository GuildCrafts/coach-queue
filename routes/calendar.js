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

router.all('/findNext', (req, res) => {
  // let coachesNextAvailable = []
  getActiveCoaches()
    .then( coachesArray => {
      const blah2 = coachesArray.map( coach => {
        const access_token = coach.google_token
        const google_calendar = gcal(access_token)
        const calendarId = coach.calendar_ids[0]
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
          Promise.resolve(findFreeSchedule(busyTime))
            .then(freeApptTimes => {
              let blah = {freeApptTimes, user:calendarId}
              console.log(blah)
              // coachesNextAvailable.push(blah)
              return blah
            })
            // .then(availableTimes => {
            //   console.log('availability', availableTimes)
            //   return res.json({availableTimes, coachesNextAvailable})
            // })
            // .catch(error => console.log('This is times error', error))
        })
      })
      return blah2
    })
    .then(blah2 => {
      console.log('=============>', blah2)
      res.json(blah2)
    })
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
