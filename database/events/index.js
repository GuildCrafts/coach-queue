const db = require( '../db' )

const CREATE = `
  INSERT INTO events (request_id, data, name, created_at, updated_at)
  VALUES ( $1, $2, $3, now(), now() )
  RETURNING *
`
module.exports = {
  create: ( request_id, data, event_name ) => db.one( CREATE, [ request_id, data, event_name ])
}