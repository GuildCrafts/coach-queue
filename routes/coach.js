var express = require('express')
var router = express.Router()

router.get('/', (req, res, next)  => {
  res.json({ title: 'Coach' })
})

router.get('/active', (req, res, next)  => {
  res.json({ title: 'Active get, fetch active coaches' })
})

router.post('/active', (req, res, next)  => {
  res.json({ title: 'Active post, activate coach' })
})

module.exports = router