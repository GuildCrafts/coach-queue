const {expect, app, chai} = require('../setup')

describe('Appointment Route', () => {

  describe('GET set appointment homepage /', () => {
    it('should return object with title property', done => {
      chai.request(app)
        .get('/appointment')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('title').eql('create appointment')
          done()
        })
    })
  })

})