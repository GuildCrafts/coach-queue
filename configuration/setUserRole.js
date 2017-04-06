const db = require( '../database/' )
const { Player } = db

const setRole = ( request, response, next ) => {
  Player.isCoach( request.user.handle )
    .then( ({is_coach}) => {
      request.user.is_coach = is_coach

      next()
    })
    .catch( error => next() )
}

module.exports = { setRole }
