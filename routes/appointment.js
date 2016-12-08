gvar express = require('express')
var router = express.Router()

router.get('/', (req, res, next)  => {
  res.render('index', { title: 'create appointment' })
})

module.exports = router