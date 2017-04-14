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

module.exports = {
  forRequest: request_id => db.any( FOR_REQUEST, request_id ),
  forCoach: coach_id => db.any( FOR_COACH, coach_id )
}