const debug = require('debug')('coach-queue:dispatch:create');
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { CREATE } = require( './constants' )
const { Request, Event } = db

const createEvent = ( question, by ) => request => {
  return Promise.all([
    request,
    Event.create( request.request_id, { question, by }, CREATE ),
    []
  ])
}

const normalizeEvents = ([ request, event, events ]) => {
  if( event === undefined ) {
    return [ request, events ]
  } else {
    return [ request, [ event ]]
  }
}

const normalizeRequest = ([ request, events ]) =>
  Object.assign( {}, request, { events })

const create = ({ learner_id, learner_name, question }) => {
  debug({ learner_id, learner_name, question })

  return Request.forTeam( learner_id )
    .then( request => {
      if( request === null ) {
        return Request.create( learner_id ).then( createEvent( question, learner_name ) )
      } else {
        return [ request, request.events ]
      }
    })
    .then( normalizeRequest )
}

module.exports = create
