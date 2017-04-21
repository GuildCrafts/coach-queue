const debug = require('debug')('coach-queue:dispatch:claim')
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { CLAIM } = require( './constants')
const { Request, Event } = db
const calculateStats = require( '../stats/' )
const validate = require( './validate' )

const claim = ({ learner_id, request_id, learner_name }) => {
  const data = { request_id, claimed_by: learner_id, by: learner_name }

  debug( data )

  return validate( request_id, CLAIM, "This request has already been claimed." )
    .then( _ => Event.create( request_id, data, CLAIM ))
    .then( result => Promise.all([
      result,
      calculateStats()
    ]))
    .then( ([ result, _ ]) => result )
}

module.exports = claim
