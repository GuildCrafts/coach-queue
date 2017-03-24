const express = require('express')
const router = express.Router()
const parse = require( 'csv-parse/lib/sync' )
const upload = require( '../../database/upload' )

const db = require( '../../database/' )
const { Admin } = db

router.get( '/', (request, response) => {
  response.render( 'admin/index' )
})

router.post( '/upload', ( request, response ) => {
  const records = parse( request.files.teams.data.toString() )

  upload( records.slice( 1 ) ).then( result =>
    response.redirect( '/admin/coaches' )
  )
})

router.get( '/coaches', ( request, response ) => {
  Admin.data()
    .then( data => response.render( 'admin/coaches', { data }))
})

router.post( '/coaches', ( request, response ) => {
  const coaches = request.body[ 'coaches[]' ]

  Admin.setCoaches( coaches )
    .then( result => response.redirect( '/admin/goals' ))
})

router.get( '/goals', ( request, response ) => {
  Admin.data()
    .then( data => response.render( 'admin/goals', { data }))
})



router.get('/assign-coaches', ( request, response ) => {
  response.render('admin/index', {
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
