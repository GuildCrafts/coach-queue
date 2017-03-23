var express = require('express')
var router = express.Router()

/* GET admin landing page. */
router.get('/', function( request, response, next ) {
  response.render('admin-page', {
    title: 'Admin',
    page_data: {
      showing_modal: false
    }
  })
})

router.get('/assign-coaches', function( request, response, next ) {
  response.render('admin-page', {
    title: 'Admin',
    page_data: {
      coaches: ['Amelia', 'Diana'],
      projects: ['core-team-naming', 'advanced-team-naming'],
      active_coach_data: [{
        name: 'Amelia',
        assigned_learners: ['Kim', 'Bob'],
        assigned_projects: ['core-team-naming']
      }],
      showing_modal: true
    }
  })
})

module.exports = router
