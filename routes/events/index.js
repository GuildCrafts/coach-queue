const express = require( 'express' )
const router = express.Router()
const dispatch = require( '../../events/dispatch' )

router.post( '/', ( request, response ) => {
  const data = Object.assign( {}, request.body,
    { learner_id: request.user.id, learner_name: request.user.name }
  )

  dispatch( data )
    .then( result => response.json( result ))
    .catch( error => response.json({ error, message: error.message }))
})

module.exports = router
