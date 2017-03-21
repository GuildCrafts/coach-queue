const path = require('path')
const environment = require( '../configuration/environment')()

const defaultConfiguration = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: path.join( __dirname, '/migrations'),
    tableName: 'migrations'
  }
}

module.exports = defaultConfiguration
