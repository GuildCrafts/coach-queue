const debug = require('debug')('coach-queue:dispatch:cancel');
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { CANCEL } = require( './constants' )
const { Request, Event } = db
const validate = require( './validate' )

const cancel = ({ learner_id }) => {
  debug({ learner_id })

  Request.cancel( learner_id )
    .then( request => Event.create( request.id, {}, CANCEL ))
}

module.exports = cancel