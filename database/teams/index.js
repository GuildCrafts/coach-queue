const db = require( '../db' )

const FOR_REQUEST = `
  SELECT * FROM teams
  JOIN requests ON requests.team_id=teams.id
  WHERE requests.id=$1
`

const INFO = `
  SELECT first_players.handle AS requester, players.handle AS coach, teams.name, goals.id, goals.title, goals.link
  FROM players AS first_players
  JOIN team_players ON first_players.id=team_players.player_id
  JOIN teams ON teams.id=team_players.team_id
  JOIN goals ON goals.id=teams.goal_id
  JOIN goal_coaches ON goals.id=goal_coaches.goal_id
  JOIN players ON goal_coaches.coach_id=players.id
  WHERE first_players.id=$1 AND teams.is_current=true
`

const GOALS = `
  SELECT *
  FROM goal_coaches
  JOIN goals ON goal_id=id
  WHERE cycle=$1 AND coach_id=$2
`

const PLAYERS = `
  SELECT * FROM teams
  JOIN team_players ON team_players.team_id=teams.id
  JOIN players ON team_players.player_id=players.id
  WHERE cycle=$1
`

const forCoach = ( coach_id, cycle ) =>
  Promise.all([
    db.any( GOALS, [ cycle, coach_id ]),
    cycle
  ])
  .then( ([ goals, cycle ]) => Promise.all([
    db.any( PLAYERS, [ cycle, goals.map( g => g.id )]),
    goals
  ]))
  .catch( e => console.log( e, e.message ))

module.exports = {
  forRequest: request_id => db.any( FOR_REQUEST, request_id ),
  forCoach,
  info: user_id => db.any( INFO, user_id )
}