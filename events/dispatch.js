const debug = require('debug')('coach-queue:dispatch');
const io = require( './socketio/' )
const db = require( '../database/' )
const { Request, Event } = db

const create = require( './requests/create' )
const cancel = require( './requests/cancel' )

const assign = data => {
  debug( 'assign', { learner_id, question })
}

const dispatch = data => {
  debug( data )

  return { create, cancel }[ data.name ]( data ) ||
    Promise.reject({ message: `${data.name} is an invalid event.` })
}

module.exports = dispatch