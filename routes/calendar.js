const express = require('express')
const router = express.Router()
const moment = require('moment')
const gcal = require('google-calendar')
const rp = require('request-promise')
const {createAppointment} = require('../io/database/appointments')
const {
  findFreeSchedule, 
  findNextAppointment, 
  getAllCoachesNextAppts} = require('../models/appointment')
const {
  getActiveCoaches, 
  findUserByHandle, 
  createUser,
  updateUserByHandle} = require('../io/database/users')

//YOU WILL BE FORCED TO LOG IN TO GCAL ACCESS ANY OF THESE ROUTES

router.all('/', (request, response) => {
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
  //is githubHandle defined through params or through IDM stuff
  const github_handle = request.params.githubHandle
  request.session.github_handle = github_handle
  const {access_token} = request.session

  findUserByHandle(github_handle).then(user => {
    if (user && user.email !== null) {
      updateUserByHandle(github_handle, {google_token: access_token})
        .then(response.json({message: `You're already in the system.(redirect me to activate/deactivate page)`}))
        .catch(error => console.error(error))
    } else if (user && user.email === null) {
      response.redirect('/calendar')
    } else {
      createUser({
        github_handle, 
        active_coach: false, 
        google_token: access_token, 
      })
      .then((data) => {
        response.redirect('/calendar')
      })
      .catch(error => console.error(error))
    }
  })
})

router.all('/find_next', (request, response) => {
  //TODO: How are we capturing the mentee's information? Params?
  const access_token = request.session.access_token

  getActiveCoaches()
    .then(coachesArray => getAllCoachesNextAppts(coachesArray, access_token))
      .then(allCoachesNextAppointments => {
        // TODO: we seem to be going past the time ranges to find appt, fix the bug
        // TODO: events are created with overlap?! maybe it is not finding the 
          // newly created events when you check for busytimes in the next request
        const sortedAppointments = allCoachesNextAppointments.sort((a, b) => 
          a.earliestAppointment.start > b.earliestAppointment.start
        )
        let earliestApptData = sortedAppointments[0]
        let {calendarId, earliestAppointment} = earliestApptData
        console.log('earliest Appointment Start: ', earliestAppointment.start)
        
        let event = {
          'summary': 'Coaching session with **insert Github Handle***',
          'description': 'Go get \'em champ',
          'start': {
            'dateTime': earliestAppointment.start.toDate(),
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': earliestAppointment.end.toDate(),
            'timeZone': 'America/Los_Angeles'
          }
        }

        gcal(access_token).events.insert(calendarId, event, (error, data) =>
          error 
          ? res.send(500, error) 
          : createAppointment({
            appointment_start: data.start.dateTime,
            appointment_end: data.end.dateTime,
            coach_handle: earliestApptData.github_handle,
            appointment_length: 30,
            description: 'Please help.',
            // TODO take mentee_handles from the request params
            mentee_handles: [ 'luvlearning', 'cupofjoe', 'codeandstuff' ]
          })
          .then(databaseData => response.json(databaseData))
        )
      })
})


// router.all('/:calendarId', (req, res) => {
//   const { access_token } = req.session;
//   const google_calendar = gcal(access_token)
//   const { calendarId } = req.params;
//   const endOfToday = moment().startOf('day').add({h:17.5})
//   const startOfToday = moment().startOf('day').add({h:9})

//   let endOfDay = moment() > endOfToday
//     ? moment().endOf('day').add({h:17.5, ms:1})
//     : endOfToday

//   let startOfDay = moment().isBetween(endOfToday, moment().endOf('day'))
//     ? moment().endOf('day').add({h:9, ms:1})
//     : startOfToday


//   google_calendar.freebusy.query({
//     items: [{id:`${calendarId}`}],
//     timeMin: startOfDay,
//     timeMax: endOfDay
//   }, (err, data) => {
//     if (err) { return res.send(500, err) }

//     let busyTime = data.calendars[calendarId].busy
//     console.log(busyTime)
//     Promise.resolve(findFreeSchedule(busyTime))
//       .then(freeApptTimes => findNextAppointment(freeApptTimes))
//       .then( aptData => {
//         let aptStart = aptData.start
//         let aptEnd = aptData.end
//         let event = {
//           'summary': 'Coaching session with Somebody',
//           'description': 'Go get \'em champ',
//           'start': {
//             'dateTime': aptStart,
//             'timeZone': 'America/Los_Angeles'
//           },
//           'end': {
//             'dateTime': aptEnd,
//             'timeZone': 'America/Los_Angeles'
//           }
//         }
//         google_calendar.events.insert(calendarId, event, (err, data) => {
//           if (err) { return res.send(500, err) }
//           createAppointment({
//             appointment_start: data.start.dateTime,
//             appointment_end: data.end.dateTime,
//             coach_handle: 'imaleafyplant',
//             appointment_length: 30,
//             description: 'Please help.',
//             mentee_handles: [ 'luvlearning', 'cupofjoe', 'codeandstuff' ]
//           }).then(databaseData => res.json(databaseData))
//       }).catch(err => res.json(err))
//     })
//   })
// })


module.exports = router
