const express = require('express')
const router = express.Router()
const {getActiveCoaches} = require('../io/database/users')

router.get('/active', (request, response) => 
  getActiveCoaches()
    .then(coaches => response.json({coaches}))
)

router.post('/active', (request, response) => 
  response.json({ title: 'Active post, activate coach' })
)

module.exports = router