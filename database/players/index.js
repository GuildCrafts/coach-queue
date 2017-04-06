const db = require( '../db' )

const FOR_TEAM = `
  SELECT * FROM players
  JOIN team_players ON players.id=team_players.player_id
  WHERE team_players.team_id=$1
`

const IS_COACH = `SELECT is_coach FROM players WHERE handle=$1`

module.exports = {
  forTeam: team_id => db.any( FOR_TEAM, team_id ),
  isCoach: handle => db.one( IS_COACH, handle )
}
