const {env} = require('../config/config')
const config = require('../config/config_db')[env()]
const knex = require('knex')(config)

knex.truncateAllTables = () =>
  knex.schema.raw(`
    BEGIN;
    TRUNCATE users        RESTART IDENTITY CASCADE;
    TRUNCATE appointments RESTART IDENTITY CASCADE;
    COMMIT;
  `)

module.exports = knex
