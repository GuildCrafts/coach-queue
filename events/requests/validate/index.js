const db = require( '../../../database/' )
const { Request } = db

const validate = ( request_id, type, message ) =>
  Request.find( request_id )
    .then( request => {
      const { events } = request[ 0 ]

      if( events[ events.length - 1 ].name === type ) {
        return Promise.reject( new Error( message ))
      } else {
        return Promise.resolve()
      }
    })

module.exports = validate