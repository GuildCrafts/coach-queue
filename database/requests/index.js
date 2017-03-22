const db = require( '../db' )

const CREATE = `
  INSERT INTO requests (team_id, created_at, updated_at) VALUES (
    (
      SELECT teams.id FROM projects
      JOIN teams ON teams.project_id=projects.id
      JOIN team_players ON teams.id=team_players.team_id
      WHERE projects.is_current = true AND team_players.player_id=$1
    ),
    now(), now()
  ) RETURNING requests.id as request_id, team_id
`
module.exports = {
  create: player_id => db.one( CREATE, player_id )
}