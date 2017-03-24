const db = require( '../db' )

const SELECT_TEAM_ID = `
  SELECT teams.id FROM projects
  JOIN teams ON teams.project_id=projects.id
  JOIN team_players ON teams.id=team_players.team_id
  WHERE teams.is_current = true AND team_players.player_id=$1
`

const CREATE = `
  INSERT INTO requests (team_id, created_at, updated_at) VALUES (
    (${SELECT_TEAM_ID}),
    now(), now()
  ) RETURNING requests.id as request_id, team_id
`
const FOR_TEAM = `SELECT *, id as request_id FROM requests WHERE team_id=(${SELECT_TEAM_ID})`

module.exports = {
  create: player_id => db.one( CREATE, player_id ),
  forTeam: player_id => db.oneOrNone( FOR_TEAM, player_id )
}