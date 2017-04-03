const db = require( '../db' )

const FOR_TEAM = `
  SELECT goals.id, goals.link, goals.title, teams.id as team_id, players.handle as coach, players.id as coach_id FROM goals
  JOIN teams ON teams.goal_id=goals.id
  JOIN goal_coaches ON goal_coaches.goal_id=goals.id
  JOIN players ON goal_coaches.coach_id=players.id
  WHERE teams.id=$1
`

module.exports = {
  forTeam: team_id => db.one( FOR_TEAM, team_id )
}