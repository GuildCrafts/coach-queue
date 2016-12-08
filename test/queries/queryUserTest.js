const {expect, app, chai} = require('../setup')
const {
  createUser,
  findUserByLgId,
  updateUserByLgId,
  deleteUserByLgId
} = require('../../io/database/users')
const {user} = require('./testingData')

describe('queryUsers', () => {
  Promise.resolve(createUser(user))
    .then(user => {
      describe('findUser', () => {
        it('should find a user', done => {
          findUserByLgId(user.lg_id)
            .then(user => {
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
      describe('updateUser', () => {
        it('should update a user record', done => {
          updateUserByLgId(user.lg_id, { active_coach: true })
            .then(user => {
              expect(user).to.be.a('object')
              expect(user.lg_id).to.eql('1234ab')
              expect(user.can_coach).to.eql(true)
              expect(user.active_calender).to.eql(true)
              expect(user.active_coach).to.eql(true)
              expect(user.google_token).to.eql("A_TOKEN")
              done()
            })
        })
      })
      describe('deleteUser', () => {
        it('should delete a user record', done => {
          deleteUserByLgId(user.lg_id)
            .then(user => {
              //knex sets no user in db equal to 1
              expect(user).to.eql(1)
              done()
            })
        })
      })
    })
})
