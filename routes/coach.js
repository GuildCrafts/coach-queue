const express = require('express')
const router = express.Router()
const {
  getActiveCoaches,
  activateCoach,
  deactivateCoach} = require('../io/database/users')

router.get('/active', (request, response) => 
  getActiveCoaches()
    .then(coaches => response.json({coaches}))
)

router.post('/active/:githubHandle', (request, response) => {
  let {githubHandle} = request.params
  
  activateCoach(githubHandle)
    .then(response.json({ message: "You've been activated. Good Job Coach." }))
})

router.delete('/active/:githubHandle', (request, response) => {
  let {githubHandle} = request.params

  deactivateCoach(githubHandle)
    .then(response.json(
      { message: "You're no longer coaching. Take a break champ." }))
})

module.exports = router