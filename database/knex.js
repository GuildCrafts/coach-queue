const Knex = require( 'knex' )
const configuration = require('./knexfile')

const knex = Knex(configuration)

module.exports = knex
