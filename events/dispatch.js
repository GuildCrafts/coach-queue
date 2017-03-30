const debug = require('debug')('coach-queue:dispatch')
const io = require( './socketio/' )
const db = require( '../database/' )
const { CREATE, CANCEL, CLAIM, ESCALATE } = require( './requests/constants')

const { Request, Event } = db

const create = require( './requests/create' )
const cancel = require( './requests/cancel' )
const claim = require( './requests/claim' )
const escalate = require( './requests/escalate' )

const HANDLERS = {
  [CREATE]: create,
  [CANCEL]: cancel,
  [CLAIM]: claim,
  [ESCALATE]: escalate
}

const assign = data => {
  debug( 'assign', { learner_id, question })
}

const dispatch = data => {
  debug( data )

  if( HANDLERS[ data.name ] !== undefined ) {
    return HANDLERS[ data.name ]( data )
  } else {
    return Promise.reject( new Error( `${data.name} is an invalid event.` ))
  }
}

module.exports = dispatch
