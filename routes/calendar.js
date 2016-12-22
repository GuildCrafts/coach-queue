const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')
const P = require('bluebird')
const gcalP = P.promisifyAll(gcal)
const moment = require('moment')
const rp = require('request-promise')
const {findFreeSchedule, findNextAppointment} = require('../models/appointment')
const {createAppointment} = require('../io/database/appointments')
const {
  getActiveCoaches, 
  findUserByHandle, 
  createUser,
  updateUserByHandle} = require('../io/database/users')

//YOU WILL BE FORCED TO LOG IN TO GCAL ACCESS ANY OF THESE ROUTES

router.all('/', (request, response) => {
  const {access_token} = request.session
  gcal(access_token).calendarList.list((error, data) => 
    error ? response.send(500, error) : response.json(data)
  )
})


router.all('/checkIDM', (request, response) => {
  // route they hit when they first see if they're a coach, from spash screen
  // gets their github information
  const {access_token} = request.session
  response.json({message: "you're verified with idm, we're passing your github info (will redirect to /init/:githubHandle"})
})

router.all('/chooseCal', (request, response) => {
  const {access_token} = request.session
  //need to make sure github info is here..

  gcal(access_token).calendarList.list((error, data) => {
    if (error) {
      return response.send(500, error) 
    } else {
      // use radio buttons to choose which calendar to work with
      // updateUserByHandle(github_handle, {email: gCalEmail})
      response.json(data)
      // ultimately will redirect to init/:githubHandle
    }
  })
})

router.all('/init/:githubHandle', (request, response) => {
  const github_handle = request.params.githubHandle
  request.session.github_handle = github_handle
  const {access_token} = request.session

  findUserByHandle(github_handle).then(user => {
    console.log('user=============', user)
    if (user && user.email !== null) {
      console.log('got into user if block')
      updateUserByHandle(github_handle, {google_token: access_token})
      .then(response.json({message: `You're already in the system.(redirect me to activate/deactivate page)`}))
      .catch(error => console.error(error))
    } else if (user && user.email === null) {
      console.log('in the user.email is null block')
      response.redirect('/calendar/chooseCal')
    } else {
      console.log('got into else')
      createUser({
        github_handle, 
        active_coach: false, 
        google_token: access_token, 
      })
      .then((data) => {
        response.redirect('/calendar/chooseCal')
      })
      .catch(error => console.error(error))
    }
  })
})

router.all('/find_next', (request, response) => {
  const startOfToday = moment().startOf('day').add({h:9})
  const endOfToday = moment().startOf('day').add({h:17.5})

  let endOfDay = moment() > endOfToday
    ? moment().endOf('day').add({h:17.5, ms:1})
    : endOfToday

  let startOfDay = moment().isBetween(endOfToday, moment().endOf('day'))
    ? moment().endOf('day').add({h:9, ms:1})
    : startOfToday

  console.log('endofDay', endOfDay)
  console.log('startof Day', startOfDay)

  const access_token = request.session.access_token
  const google_calendar = gcal(access_token)
  getActiveCoaches()
    .then(coachesArray => {
      // console.log('coachesArray', coachesArray)
      //refactor this into a function
      P.all(coachesArray.map(coach => {
        // TODO figure out how to pass the calendarId the subsequent then blocks
        // console.log('coach info', coach)
        // console.log('session', request.session)
        console.log('coach:', coach)
        const freeBusyP = P.promisifyAll(google_calendar.freebusy)
        const calendarId = coach.calendar_ids[0]
        return freeBusyP.queryAsync({
          items: [{id:`${calendarId}`}],
          timeMin: startOfDay,
          timeMax: endOfDay
        })
        .then(coachBusyTime => {
          console.log(calendarId)
          console.log('YOUR BUSY TIME =======', coachBusyTime)
          console.dir(coachBusyTime.calendars)
          return findFreeSchedule(coachBusyTime)
        })
        .then(coachFreeTime => { 

          return {calendarId,
                  github_handle: coach.github_handle,
                  earliestAppointment: findNextAppointment(coachFreeTime.freeTime)
          }
        })
      }))      
      .then(allCoachesNextAppointments => {
        console.log('allCoaches::::', allCoachesNextAppointments)
        // TODO: we seem to be going past the time ranges to find appt, fix the bug
        const sortedAppointments = allCoachesNextAppointments.sort((a, b) => {
          return a.earliestAppointment.start > b.earliestAppointment.start
        })
        let earliestApptData = sortedAppointments[0]
        let earliestAppt = earliestApptData.earliestAppointment            
        console.log('earliestApptData', earliestApptData) 
        console.log('earliestAppt.end.toDate()', earliestAppt.end.toDate())
        // TODO events are created with overlap?! maybe it is not finding the newly created events when you check for busytimes in the next request
        let event = {
          'summary': 'Coaching session with Somebody',
          'description': 'Go get \'em champ',
          'start': {
            'dateTime': earliestAppt.start.toDate(),
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': earliestAppt.end.toDate(),
            'timeZone': 'America/Los_Angeles'
          }
        }
        console.log('earliestAppt', earliestAppt)
        // let calendarId = 

        google_calendar.events.insert(earliestApptData.calendarId, event, (err, data) => {
          if (err) { return res.send(500, err) }
          createAppointment({
            appointment_start: data.start.dateTime,
            appointment_end: data.end.dateTime,
            coach_handle: earliestApptData.github_handle,
            appointment_length: 30,
            description: 'Please help.',
            // TODO take this from the request params
            mentee_handles: [ 'luvlearning', 'cupofjoe', 'codeandstuff' ]
          }).then(databaseData => response.json(databaseData))
      })
    })
      // .then( )
      // console.log('everybody\'s next available appointments::', allCoachesNextAppointments)
      // response.json({a:1})
      // })
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
