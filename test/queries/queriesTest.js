const {createUser} = require('../../database/queries')
const {expect, app, chai} = require('../setup')

describe('QUERIES', () => {
  describe('Inserts new user', () => {
    it('should insert a user into the database', done => {
      const user = {
        lg_id: '1234ab',
        can_coach: true,
        active_calender: true,
        active_coach: false,
        google_token: "A_TOKEN"
      }

      createUser(user)
        .then(user => {
          console.log(user)
          expect(user).to.be.a('object')
          expect(user.lg_id).to.eql('1234ab')
          expect(user.can_coach).to.eql(true)
          expect(user.active_calender).to.eql(true)
          expect(user.active_coach).to.eql(false)
          expect(user.google_token).to.eql("A_TOKEN")
          done()
        })
    })
  })
})
