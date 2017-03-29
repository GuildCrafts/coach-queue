const db = require( '../db' )

const FOR_TEAM = `
  SELECT * FROM goals
  JOIN teams ON teams.goal_id=goals.id
  WHERE teams.id=$1
`

module.exports = {
  forTeam: team_id => db.one( FOR_TEAM, team_id )
}