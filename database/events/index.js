const db = require( '../db' )

const CREATE = `
  INSERT INTO events (request_id, data, name, created_at, updated_at)
  VALUES ( $1, $2, $3, now(), now() )
  RETURNING *
`
const FOR_REQUEST = `SELECT * FROM events WHERE request_id=$1`

module.exports = {
  create: ( request_id, data, event_name ) => db.one( CREATE, [ request_id, data, event_name ]),
  forRequest: request_id => db.any( FOR_REQUEST, request_id )
}