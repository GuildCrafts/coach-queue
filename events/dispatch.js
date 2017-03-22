const debug = require('debug')('coach-queue:dispatch');
const io = require( './socketio/' )
const db = require( '../database/' )
const { Request, Event } = db

const create = ({ learner_id, question }) => {
  debug( 'create', { learner_id, question })

  return Request.create( learner_id )
    .then( request => Promise.all([
      Event.create( request.request_id, { question }, 'create' ),
      request
    ]))
    .then( ([ event, request ]) =>
      Object.assign( {}, request, { events: [ event ] })
    )
}

const assign = data => {
  debug( 'assign', { learner_id, question })


}

const dispatch = data => {
  return { create, assign }[ data.name ]( data ) ||
    Promise.reject({ message: `${data.name} is an invalid event.` })
}

module.exports = dispatch