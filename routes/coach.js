const express = require('express')
const router = express.Router()
const {
  createUser,
  getActiveCoaches,
  activateCoach,
  deactivateCoach} = require('../io/database/users')

router.get('/active', (request, response) =>
  getActiveCoaches().then(coaches => response.json(coaches))
)

router.get('/init/:githubHandle', (request, response) => {
  console.log(request.session)
  const user = {
    github_handle: request.params.githubHandle,
    can_coach: true,
    active_calender: true,
    active_coach: false,
    google_token: null,
    created_at: null,
    updated_at: null,
    email: "someone@someone.com",
    calendar_ids: ["someone@someone.com"]
  }
  createUser(user).then(newUser => response.redirect('/auth'))
})

router.post('/active/:githubHandle', (request, response) => {
  activateCoach(request.params.githubHandle)
    .then(response.json({ message: "You've been activated. Good Job Coach." }))
})

router.delete('/active/:githubHandle', (request, response) => {
  deactivateCoach(request.params.githubHandle)
    .then(response.json({ message: "You're no longer coaching. Take a break." }))
})

module.exports = router
