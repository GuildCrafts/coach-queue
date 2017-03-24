process.env.NODE_ENV = 'test'

const environment = require('../configuration/environment')()

const chai = require('chai')
const chaiHttp = require('chai-http')

global.expect = chai.expect
global.db = require( '../database/db' )
global.chai = chai
chai.use( chaiHttp )

const database = require('../database/index')

beforeEach(database.reset)
