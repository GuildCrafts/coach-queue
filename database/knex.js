const {env} = require('../config/config')
const config = require('../config/DBconfig')[env()]
const knex = require('knex')(config)

module.exports = knex
