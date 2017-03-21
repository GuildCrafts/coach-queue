const fs = require('fs')

const load = () => {
  if ( fs.existsSync( `.env.${process.env.NODE_ENV}` ) ) {
    require( 'dotenv' ).config()
  } else {
    console.log( ".env not found, skipping dotenv config..." )
  }
}

module.exports = load
