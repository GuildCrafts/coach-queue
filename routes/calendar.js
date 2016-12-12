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

//the route people hit after appt submission form
router.all('/makeAppointment', (req, res) => {
  var accessToken = req.session.access_token

  // who's in the appt in an array
  // appt length
  // desc
  getActiveCoaches().then(coaches => {
    // run the api for each coach and get their weekly schedule
  })

  gcal(accessToken).calendarList.list((err, data) => 
    err ? res.send(500,err) : res.json(data)
  )
})


// ??need to add emails to user schema???
//add accessable cal's to user schema


//hits a route that accesses all available coaches 

  // for each coach find next available time
  // create cal entry for coach w next available time
  // Coach gets notified somehow
//user gets confirmation page in UI

router.all('/:calendarId', (req, res) => {
  const {access_token} = req.session
  const {calendarId} = req.params

  //TODO Date: find current week and set to time Max

  gcal(access_token).freebusy.query({
    items: [{id:`${calendarId}`}],
    timeMin: new Date(), 
    timeMax: new Date("2016-12-15")
  }, 
  (err, data) => err ? res.send(500,err) : data => {
    res.json(data)
  })
})

module.exports = router