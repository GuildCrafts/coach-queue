const debug = require('debug')('coach-queue:dispatch')
const io = require( './socketio/' )
const db = require( '../database/' )
const { 
  CREATE, CANCEL, CLAIM, ESCALATE 
} = require( './requests/constants')

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

const lookupHandler = name =>
  new Promise( (resolve, reject) => {
    if( HANDLERS[ name ] === undefined ) {
      resolve( HANDLERS[ name ])
    } else {
      reject( new Error( 
        `${data.name} is an invalid event.` 
      ))
    }
  })

const getRequests = result =>
  Promise.all([ Request.all, result ])

const broadcast = ([ requests, result ]) => {
  io.to( '/events' ).emit( 'event', { requests })

  return result
}

const dispatch = data => {
  debug( data )

  lookupHandler( data.name )
    .then( handler => handler( data ))
    .then( getRequests )
    .then( broadcast )
    .catch( error => console.log( error ))
}

module.exports = dispatch
