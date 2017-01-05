const {expect, app, chai} = require('../setup')

describe('Coach Route: ', () => {

  xdescribe('GET active coaches at /coach/active', () => {
    it('should get list of active coaches', done => {
      chai.request(app)
        .get('/api/v1/coaches/active')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('coaches')
          done()
        })
    })
  })

  xdescribe('POST activate coaching at /coaches/activate', () => {
    it('should activate a specific coach', done => {
      chai.request(app)
        .post('/api/v1/coaches/active/nope-not-ever')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('message')
            .eql("You\'ve been activated. Good Job Coach.")
          done()
        })
    })
  })

  describe('DELETE deactivate coaching at /coaches/activate', () => {
    it('should deactivate a specific coach', done => {
      chai.request(app)
        .delete('/api/v1/coaches/active/nope-not-ever')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('message')
            .eql("You're no longer coaching. Take a break.")
          done()
        })
    })
  })
})
