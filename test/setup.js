process.env.NODE_ENV = 'test'
const chai = require('chai')
const {expect} = chai
const should = chai.should()
const chaiHttp = require('chai-http')
const chaiDatetime = require('chai-datetime')
const {jsdom} = require('jsdom')
const {mount,shallow} = require('enzyme')

const {testEnv} = require('../config/config')
const config = require('../config/DBconfig')[testEnv()]
const knex = require('knex')(config)

const app = require('../app')
const React = require('react')

const App = require('../client/App').default
const ListCoaches = require('../client/ListCoaches').default

knex.truncateAllTables = () =>
  knex.schema.raw(`
    BEGIN;
    TRUNCATE users        RESTART IDENTITY CASCADE;
    TRUNCATE appointments RESTART IDENTITY CASCADE;
    COMMIT;
  `)

chai.use(chaiDatetime)
chai.use(chaiHttp)

after(() =>
  knex.migrate.latest().then(() => knex.truncateAllTables() )
)

const doc = jsdom('<!doctype html></html><body></body></html>')
global.document = doc
global.window = doc.defaultView
global.navigator = {
  userAgent: 'node.js'
}

module.exports = {
  chai,
  expect,
  should,
  mount,
  shallow,
  knex,
  React,
  app,
  App,
  ListCoaches
}
