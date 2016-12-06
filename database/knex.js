require('../config/environment')
const config = require('../knexfile')[process.env.NODE_ENV]
const knex = require('knex')(config)

knex.truncateAllTables = () =>
  knex.schema.raw(`
    BEGIN;
    TRUNCATE users        RESTART IDENTITY CASCADE;
    TRUNCATE appointments RESTART IDENTITY CASCADE;
    COMMIT;
  `)

module.exports = knex
