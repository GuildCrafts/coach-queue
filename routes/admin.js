var express = require('express')
var router = express.Router()

/* GET admin landing page. */
router.get('/', function( request, response, next ) {
  response.render('admin', { title: 'Admin' })
})

module.exports = router
