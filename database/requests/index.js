const db = require( '../db' )
const Event = require( '../events' )
const decorate = require( './decorate' )

const SELECT_TEAM_ID = `
  SELECT teams.id FROM goals
  JOIN teams ON teams.goal_id=goals.id
  JOIN team_players ON teams.id=team_players.team_id
  WHERE teams.is_current = true AND team_players.player_id=$1
`

const CREATE = `
  INSERT INTO requests (team_id, created_at, updated_at) VALUES (
    (${SELECT_TEAM_ID}),
    now(), now()
  ) RETURNING requests.id as request_id, team_id
`

const CANCEL = `
  UPDATE requests SET resolved_at=now()
  WHERE resolved_at IS NULL AND team_id = (${SELECT_TEAM_ID})
  RETURNING id
`

const FOR_TEAM = `
  SELECT *, id as request_id FROM requests
  WHERE resolved_at IS NULL AND team_id=(${SELECT_TEAM_ID})
`

const UNRESOLVED = `SELECT * FROM requests WHERE resolved_at IS NULL`

const forTeam = player_id =>
  db.oneOrNone( FOR_TEAM, player_id )
    .then( request => request === null ? Promise.reject( null ) : request )
    .then( request => Promise.all([
      Event.forRequest( request.id ),
      request
    ]))
    .then( ([ events, request ]) =>
      Object.assign( {}, request, { events })
    )
    .catch( error => null )

const unresolved = () => db.any( UNRESOLVED )

module.exports = {
  create: player_id => db.one( CREATE, player_id ),
  cancel: player_id => db.one( CANCEL, player_id ),
  forTeam,
  unresolved,
  all: () => unresolved().then( decorate )
}
