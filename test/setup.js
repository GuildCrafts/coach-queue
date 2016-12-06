const {testEnv} = require('../config/config')
testEnv()

const chai = require('chai')
const {expect} = chai
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../app')

chai.use(chaiHttp)

module.exports = {
chai,
expect,
should,
app
}
