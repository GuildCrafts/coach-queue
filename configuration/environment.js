const fs = require('fs')
const path = require('path')

const load = () => {
  const filePath = path.join(__dirname, `.env.${process.env.NODE_ENV}`)
  if ( fs.existsSync( filePath ) ) {
    require( 'dotenv' ).config({ path: filePath })
  } else {
    console.log( `.env.${process.env.NODE_ENV} not found, skipping dotenv configuration...` )
  }
}

module.exports = load
