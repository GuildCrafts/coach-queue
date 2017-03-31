const express = require( 'express' )
const router = express.Router()
const dispatch = require( '../../events/dispatch' )

router.post( '/', ( request, response ) => {
  const data = Object.assign( {}, request.body, { learner_id: request.user.id })

  dispatch( data )
    .then( result => response.json( result ))
    .catch( error => response.json({ error, message: error.message }))
})

// router.post( '/io', ( request, response ) => {
//   const channel = '/tests'
//   const event_name = 'test'
//   const message = { hello: 'world' }

//   io.to( channel ).emit( event_name, message )
//   response.json({ channel, event_name, message })
// })

module.exports = router
