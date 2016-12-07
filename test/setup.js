process.env.NODE_ENV = 'test'
const chai = require('chai')
const {expect} = chai
const should = chai.should()
const chaiHttp = require('chai-http')
const chaiDatetime = require('chai-datetime')
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
  
chai.use(chaiDatetime)
chai.use(chaiHttp)

module.exports = {
  chai,
  expect,
  should,
  knex,
  app
}
