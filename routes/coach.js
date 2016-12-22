const express = require('express')
const router = express.Router()
const {
  createUser,
  getActiveCoaches,
  activateCoach,
  deactivateCoach,
  findUserByHandle,
  updateUserByHandle} = require('../io/database/users')

router.get('/active', (request, response) =>
  getActiveCoaches().then(coaches => response.json(coaches)))

router.get('/active/:githubHandle', (request, response) => {
  const github_handle = request.params.githubHandle
  const {access_token} = request.session
  findUserByHandle(github_handle).then(user => {
    if (user) {
      activateCoach(github_handle)
      .then((user) => {
        console.log('user from activate coach: ', user.github_handle)
        console.log('inside update user by handle, token: ', access_token)
        return updateUserByHandle(github_handle, {google_token: access_token})
      })
      .then(response.json({ message: "You've been activated. Good Job Coach." }))
      .catch(error => console.error(error))
    } else {
      createUser({
        github_handle, 
        active_coach: true, 
        google_token: request.session.access_token
      })
      .then(() => {
        request.session.github_handle = github_handle
        response.redirect('/google/auth')
      })
      .catch(error => console.error(error))
    }
  })
})

router.delete('/active/:githubHandle', (request, response) => {
  deactivateCoach(request.params.githubHandle)
    .then(response.json({ message: "You're no longer coaching. Take a break." }))
})

module.exports = router
