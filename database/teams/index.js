const db = require( '../db' )

const FOR_REQUEST = `
  SELECT * FROM teams
  JOIN requests ON requests.team_id=teams.id
  WHERE requests.id=$1
`

const FOR_COACH = `
  SELECT * FROM goal_coaches
  JOIN goals ON goal_coaches.goal_id=goals.id
  JOIN teams ON teams.goal_id=goals.id
  JOIN team_players ON teams.id=team_players.team_id
  JOIN players ON team_players.player_id=players.id
  WHERE coach_id=$1
  AND is_current=true
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

module.exports = {
  forRequest: request_id => db.any( FOR_REQUEST, request_id ),
  forCoach: coach_id => db.any( FOR_COACH, coach_id ),
  info: user_id => db.any( INFO, user_id )
}