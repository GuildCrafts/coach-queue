process.env.NODE_ENV = 'test'

const environment = require('../configuration/environment')()

const chai = require('chai')
const pgp = require('pg-promise')()

global.expect = chai.expect
global.db = pgp(process.env.DATABASE_URL)

const database = require('../database/index')

beforeEach(database.reset)
