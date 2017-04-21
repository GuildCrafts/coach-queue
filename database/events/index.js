const db = require( '../db' )

const CREATE = `
  INSERT INTO events (request_id, data, name, created_at, updated_at)
  VALUES ( $1, $2, $3, now(), now() )
  RETURNING *
`
const FOR_REQUEST = `SELECT * FROM events WHERE request_id=$1 ORDER BY created_at ASC`

const CURRENT_CYCLE = `
  SELECT * FROM events
  JOIN requests ON events.request_id=requests.id
  JOIN teams ON teams.id=requests.team_id
  WHERE teams.is_current=true
`

module.exports = {
  create: ( request_id, data, event_name ) => db.one( CREATE, [ request_id, data, event_name ]),
  forRequest: request_id => db.any( FOR_REQUEST, request_id ),
  currentCycle: () => db.any( CURRENT_CYCLE )
}