const express = require('express')
const router = express.Router()
const parse = require( 'csv-parse/lib/sync' )
const upload = require( '../../database/upload' )

router.get( '/', ( request, response ) => {
  response.render( 'admin/index', {
    title: 'Admin',
    page_data: { showing_modal: false }
  })
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

router.post( '/upload', ( request, response ) => {
  const data = request.files.teams.data.toString()
  const records = parse( data )

  upload( records.slice( 1 ) ).then( result => response.json( result ))
})

module.exports = router
