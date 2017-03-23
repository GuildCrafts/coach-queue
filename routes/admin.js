var express = require('express')
var router = express.Router()

/* GET admin landing page. */
router.get('/', function( request, response, next ) {
  response.render('admin-page', {
    title: 'Admin',
    coaches: ['Amelia', 'Diana'],
    teams: ['fanciful-moose', 'oblong-penguin'],
    active_coach_data: [{
      coach: 'Amelia',
      learners: ['Kim', 'Bob'],
      projects: ['oblong-penguin']
    }]
  })
})

module.exports = router
