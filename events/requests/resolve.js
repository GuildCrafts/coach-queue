const debug = require('debug')('coach-queue:dispatch:resolve');
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { RESOLVE } = require( './constants' )
const { Request, Event } = db
const validate = require( './validate' )

const resolve = ({ learner_id }) => {
  debug({ learner_id })

  Request.resolve( learner_id )
    .then( request => Event.create( request.id, {}, RESOLVE ))
}

module.exports = resolve