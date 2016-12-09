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

router.post('/active/:githubhandle', (request, response) => 
  const {githubhandle} = request.params
  //UUID?
  activateCoach('nope')
    .then(response.json({ message: "You've been activated. Good Job Coach." }))
    .catch(error => response.json({error}))
)

router.delete('/active/:githubhandle', (request, response) => 
  const {githubhandle} = request.params
  //UUID?? 
  deactivateCoach('nope')
    .then(response.json(
      { message: "You're no longer coaching. Take a break, you deserve it." }))
    .catch(error => response.json({error}))
)

module.exports = router