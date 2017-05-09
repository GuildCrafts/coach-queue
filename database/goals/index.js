const db = require( '../db' )

const FOR_TEAM = `
  select goals.id, goals.link, goals.title, teams.id as team_id, coach_id, players.handle from teams
  join goal_coaches on goal_coaches.goal_id=teams.goal_id and goal_coaches.cycle=teams.cycle
  join goals on goal_coaches.goal_id=goals.id
  join players on players.id=coach_id
  where teams.id=$1
`

module.exports = {
  forTeam: team_id => db.one( FOR_TEAM, team_id )
}
