process.env.NODE_ENV = 'test'
const chai = require('chai')
const {expect} = chai
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../app')

const {testEnv} = require('../config/config')
const config = require('../config/DBconfig')[testEnv()]
const knex = require('knex')(config)

knex.truncateAllTables = () =>
  knex.schema.raw(`
    BEGIN;
    TRUNCATE users        RESTART IDENTITY CASCADE;
    TRUNCATE appointments RESTART IDENTITY CASCADE;
    COMMIT;
  `)

chai.use(chaiHttp)

beforeEach(() =>
  knex.migrate.latest().then(() => knex.truncateAllTables() )
)

module.exports = {
  chai,
  expect,
  should,
  knex,
  app
}
