const debug = require('debug')('coach-queue:dispatch:claim')
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { CLAIM } = require( './constants')
const { Request, Event } = db

const claim = ({ learner_id, request_id }) => {
  const data = { request_id, claimed_by: learner_id }

  debug( data )

  return Event.create( request_id, data, CLAIM )
}

module.exports = claim
