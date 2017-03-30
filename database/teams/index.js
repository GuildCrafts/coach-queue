const db = require( '../db' )

const FOR_REQUEST = `
  SELECT * FROM teams
  JOIN requests ON requests.team_id=teams.id
  WHERE requests.id=$1
`

module.exports = {
  forRequest: request_id => db.any( FOR_REQUEST, request_id )
}