const db = require( '../db' )

const CYCLE_NUMBER = 0
const ELO = 1
const EMAIL = 2
const FIRST_VOTE = 3
const GOAL_NUMBER = 4
const RECOMMENDED_TEAM_SIZE = 5
const GOAL_TITLE = 6
const GOT_VOTE = 7
const HANDLE = 8
const NAME = 9
const PLAYER_ID = 10
const POOL_NAME = 11
const PROJECT_NAME = 12
const SECOND_VOTE = 13
const XP = 14

const resetCurrentTeams = () => db.any( 'UPDATE teams SET is_current=false' )

const resetCoaches = _ =>
  db.any( 'UPDATE players SET is_coach=false' )
    .then( _ => db.any( 'TRUNCATE goal_coaches' ))

const insertGoals = csvGoals => _ =>
  db.any( 'SELECT id FROM goals' )
    .then( goalIds => {
      const existingGoalIds = goalIds.map( g => g.id )

      const uniqueGoals = csvGoals.reduce( (memo, goal) => {
        if( memo[ goal.id ] === undefined && ! existingGoalIds.includes( parseInt( goal.id ))) {
          memo[ goal.id ] = goal
        }
        return memo
      }, {})

      const newGoals = Object.keys( uniqueGoals ).map( g => uniqueGoals[ g ])

      return Promise.all( newGoals.map( goal => db.none( 'INSERT INTO goals ( id, link, title ) VALUES ( ${id}, ${link}, ${title} )', goal ) ))
    })

// TODO This is shitty, should do with http://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise
const insertNewTeams = teams => _ =>
  Promise.all( teams.map( team => db.one( 'INSERT INTO teams (name, goal_id, is_current, cycle) VALUES ( ${name}, ${goal_id}, true, ${cycle} ) RETURNING id, name', team ) ))

const getAllPlayers = newTeams =>
  Promise.all([
    db.any( 'SELECT * FROM players' ),
    newTeams
  ])

const addNewPlayers = cyclePlayers => ([ currentPlayers, newTeams ]) => {
  const currentPlayerIds = currentPlayers.map( p => p.id )
  const newPlayers = cyclePlayers.filter( p => ! currentPlayerIds.includes( p.id ))

  return Promise.all( newPlayers.map( player => db.one( 'INSERT INTO players ( id, handle ) VALUES ( ${id}, ${handle} ) RETURNING *', player ) ))
    .then( _ => getAllPlayers( newTeams ))
}

const addTeamPlayers = records => ([ newPlayers, newTeams ]) => {
  const teamLookup = newTeams.reduce( (memo, team) => {
    memo[ team.name ] = team.id
    return memo
  }, {} )

  const teamPlayers = records.map( record =>
    db.none(
      'INSERT INTO team_players ( team_id, player_id) VALUES ( $1, $2 )',
      [ teamLookup[ record[PROJECT_NAME] ], record[ PLAYER_ID ] ]
    )
  )

  return Promise.all( teamPlayers )
}

const upload = records => {
  return resetCurrentTeams()
    .then( resetCoaches )
    .then( insertGoals( goals( records )))
    .then( insertNewTeams( teams( records )))
    .then( getAllPlayers )
    .then( addNewPlayers( players( records )))
    .then( addTeamPlayers( records ))
}

const goals = records =>
  records.map( record => ({
    id: parseInt( record[ GOAL_NUMBER ] ),
    link: `//jsdev.learnersguild.org/goals/${record[ GOAL_NUMBER ]}`,
    title: record[ GOAL_TITLE ]
  }))

const players = records =>
  records.map( record => ({
    id: record[ PLAYER_ID ],
    handle: record[ HANDLE ]
  }))

const teams = records => {
  const unique = records.reduce( (memo, record) => {
    if( memo[ record[ PROJECT_NAME ]] === undefined ) {
      memo[ record[ PROJECT_NAME ] ] = {
        name: record[ PROJECT_NAME ],
        goal_id: parseInt( record[ GOAL_NUMBER ] ),
        cycle: parseInt(record[ CYCLE_NUMBER ])
      }
    }

    return memo
  }, {} )

  return Object.keys( unique ).map( name => unique[ name ])
}

module.exports = upload