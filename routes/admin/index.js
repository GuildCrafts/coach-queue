const express = require('express')
const router = express.Router()
const parse = require( 'csv-parse/lib/sync' )
const upload = require( '../../database/upload' )

const db = require( '../../database/' )
const { Admin, Statistics } = db

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

const addCountToCoaches = data => {
  const coaches = data.coaches.map( coach => {
    const counts = data.goal_counts
      .filter( goal_coach => goal_coach.coach_id === coach.id )
      .reduce( (memo, goal_coach) => {
        memo.player_count += parseInt( goal_coach.player_count )
        memo.team_count += parseInt( goal_coach.team_count )

        return memo
      }, { player_count: 0, team_count: 0 })

    return Object.assign( {}, coach, { counts })
  })

  return Object.assign( {}, data, { coaches })
}

router.get( '/goals', ( request, response ) => {
  Admin.data()
    .then( addCountToCoaches )
    .then( data => response.render( 'admin/goals', { data }))
})

router.post( '/goals', ( request, response ) => {
  const data = request.body.data

  Statistics.currentCycle()
    .then( cycle =>
      Promise.all( data.map( assignment =>
        Admin.assignCoach( Object.assign( {}, assignment, { cycle })))
      )
    )
    .then( result => response.json( result ))
})

router.get( '/summary', ( request, response ) => {
  response.render( 'admin/summary' )
})

router.get( '/summary/data', ( request, response ) => {
  Admin.data()
    .then( addCountToCoaches )
    .then( data => response.json( data ))
})

module.exports = router
