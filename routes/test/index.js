const express = require( 'express' )
const router = express.Router()
const io = require( '../../events/socketio' )

router.get( '/', ( request, response ) => {
  response.render( 'test/index' )
})

router.post( '/io', ( request, response ) => {
  const event_name = 'test'
  const message = { hello: 'world' }

  io.emit( event_name, message )
  response.json({ event_name, message })
})

module.exports = router
