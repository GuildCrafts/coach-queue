const {expect, app, chai} = require('../setup')

describe('Coach Route', () => {

  describe('GET active coaches at /coach/active', () => {
    it('should get list of active coaches: WIP, UPDATE this test', done => {
      chai.request(app)
        .get('/api/v1/coaches/active')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          done()
        })
    })
  })

  describe('GET users at /users', () => {
    it('should activate: WIP, UPDATE this test', done => {
      chai.request(app)
        .post('/api/v1/coaches/active')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('title').eql('Active post, activate coach')
          done()
        })
    })
  })
})