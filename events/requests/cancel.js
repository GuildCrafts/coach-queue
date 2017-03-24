const debug = require('debug')('coach-queue:dispatch:cancel');
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { Request, Event } = db

const cancel = ({ learner_id }) => {
  debug({ learner_id })

  return Request.cancel( learner_id )
    .then( request => Event.create( request.id, {}, 'cancel' ))
}

module.exports = cancel