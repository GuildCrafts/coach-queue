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
    .then( data => {
      console.log( data )
      response.render( 'admin/goals', { data })
    })
})

router.post( '/goals', ( request, response ) => {
  const goals = request.body[ 'goals[]' ]

  console.log( goals )
})

module.exports = router
