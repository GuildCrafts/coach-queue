const express = require('express')
const gcal = require('google-calendar')
const router = express.Router()
const {
  createUser,
  getActiveCoaches,
  deactivateCoach,
  findUserByHandle,
  updateUserByHandle} = require('../io/database/users')
const {extractCalendarIds} = require('../models/calendar') ;
const {ensureGoogleAuth} = require('../middleware')

router.get('/active', (request, response) =>
  getActiveCoaches().then(coaches => response.json(coaches)))

// TODO this should be a post request
router.all('/active/:githubHandle', ensureGoogleAuth, (request, response) => {
  //TODO: dont store unnecessary things inside the session object. we can access
  //githubhandle from the req.idmUser now
  const github_handle = request.params.githubHandle
  request.session.github_handle = github_handle
  const {access_token, google_refresh_token} = request.session

  findUserByHandle(github_handle).then(user => {
    gcal(access_token).calendarList.list((error, calendarList) => {
      if (error) {          
        return response.send(500, error.stack)
      } else {
      // TODO use radio buttons to choose which calendar to work with
        if (user) {
          updateUserByHandle(github_handle,
                             {active_coach: true})
            .then(() => response.json({message: 'Congrats! You are on coach duty!'}))
            .catch(error => response.json(error))
        } else {
          createUser({github_handle,
                      active_coach: true,
                      google_token: access_token,
                      google_refresh_token: google_refresh_token,
                      calendar_ids: extractCalendarIds(calendarList)})
            .then(() => response.json({message: 'Congrats! You have been activated as a coach.'}))
            .catch(error => response.json(error))
        }
      }
    })
  })
  .catch(error => console.error(error))
})

router.delete('/active/:githubHandle', (request, response) => {
  deactivateCoach(request.params.githubHandle)
    .then(response.json({ message: "You're no longer coaching. Take a break." }))
})

module.exports = router
