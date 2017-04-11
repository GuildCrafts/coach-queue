const express = require( 'express' )
const router = express.Router()
const db = require( '../database/' )
const { Request, Event } = db

router.get( '/', ( request, response ) => {
  if( request.user.is_coach ){
    response.redirect( '/coach' )
  } else {
    response.render( 'learner/index' )
  }
})

router.get( '/request', (req, res) =>
  Request.forTeam( req.user.id )
    .then( request => res.json( request ))
)

module.exports = router
