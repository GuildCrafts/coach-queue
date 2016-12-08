const express = require('express')
const router = express.Router()
const {getActiveCoaches, activateCoach} = require('../io/database/users')

router.get('/active', (request, response) => 
  getActiveCoaches()
    .then(coaches => response.json({coaches}))
)

router.get('/activate', (request, response) => 
  activateCoach('nope')
    .then(response.json({ message: "You've been activated. Good Job Coach." }))
    .catch(error => response.json({error}))
)

module.exports = router