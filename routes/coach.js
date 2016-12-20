const express = require('express')
const router = express.Router()
const {
  createUser,
  getActiveCoaches,
  activateCoach,
  deactivateCoach,
  findUserByHandle} = require('../io/database/users')

router.get('/active', (request, response) =>
  getActiveCoaches().then(coaches => response.json(coaches)))

router.get('/active/:githubHandle', (request, response) => {
  const github_handle = request.params.githubHandle

  findUserByHandle(github_handle).then(user => {
    if(user) {
      activateCoach(github_handle)
        .then(response.json({ message: "You've been activated. Good Job Coach." }))
    } else {
      createUser({github_handle, active_coach: true})
        .then(() => {
          request.session.github_handle = github_handle
          response.redirect('/google/auth')
        })
    }
  })
})

router.delete('/active/:githubHandle', (request, response) => {
  deactivateCoach(request.params.githubHandle)
    .then(response.json({ message: "You're no longer coaching. Take a break." }))
})

module.exports = router
