const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect

chai.use(chaiHttp)

it('redirects to idm login', function() {
  chai.request('http://localhost:3000')
    .get('/')
    .end( function(err, res) {
      expect( res ).to.redirectTo('http://idm.learnersguild.org')
  })
})
