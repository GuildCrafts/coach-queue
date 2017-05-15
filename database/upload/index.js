const db = require( '../db' )
const Statistics = require( '../statistics' )

const CYCLE_UUID = 0
const CYCLE_NUMBER = 1
const ELO = 2
const EMAIL = 3
const FIRST_VOTE = 4
const GOAL_LEVEL = 5
const GOAL_NUMBER = 6
const RECOMMENDED_TEAM_SIZE = 7
const GOAL_TITLE = 8
const GOT_VOTE = 9
const HANDLE = 10
const LEVEL = 11
const LEVEL_V2 = 12
const NAME = 13
const PLAYER_ID = 14
const POOL_NAME = 15
const PROJECT_NAME = 16
const SECOND_VOTE = 17
const XP = 18

const resetCurrentTeams = () => db.any( 'UPDATE teams SET is_current=false' )

const resetCoaches = _ =>
  db.any( 'UPDATE players SET is_coach=false' )

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
  Promise.all( teams.map( team => db.one( 'INSERT INTO teams (name, goal_id, is_current, cycle) VALUES ( ${name}, ${goal_id}, true, ${cycle} ) RETURNING *', team ) ))

const addInitialCycleStatistics = teams =>
  Statistics.currentCycle()
    .then( cycle => Promise.all([
      Statistics.resetCycle( cycle, []),
      teams
    ]))

const initializeGoalCoaches = ([ _, teams ]) => {
  const cycle = teams[ 0 ].cycle
  const cycleGoals = teams.reduce( (memo, { goal_id }) => {
    if( ! memo.includes( goal_id ) ) {
      memo.push( goal_id )
    }

    return memo
  }, [] )

  return Promise.all(
    cycleGoals.map( goal_id => db.any(
        `INSERT INTO goal_coaches ( goal_id, coach_id, cycle) VALUES ( $1, '', $2 )`,
        [ goal_id, cycle ]
      )
    )
  ).then( _ => teams )
}

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
    .then( addInitialCycleStatistics )
    .then( initializeGoalCoaches )
    .then( getAllPlayers )
    .then( addNewPlayers( players( records )))
    .then( addTeamPlayers( records ))
}

const goals = records =>
  records.map( record => ({
    id: parseInt( record[ GOAL_NUMBER ] ),
    link: `//jsdev.learnersguild.org/goals/${record[ GOAL_NUMBER ]}`,
    title: record[ GOAL_TITLE ],
    level: record[ GOAL_LEVEL ]
  }))

const players = records =>
  records.map( record => ({
    id: record[ PLAYER_ID ],
    handle: record[ HANDLE ],
    level: record[ LEVEL ],
    level_v2: record[ LEVEL_V2 ]
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