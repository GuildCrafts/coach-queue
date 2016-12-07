const {expect, app, chai} = require('../setup')

const {
  createUser, 
  findUserByLgId,
  updateUserByLgId,
  deleteUserByLgId } = require('../../database/queryUsers')

describe('queryUsers', () => {
  const user = {
    lg_id: '1234ab',
    can_coach: true,
    active_calender: true,
    active_coach: false,
    google_token: "A_TOKEN"
  }

  describe('Inserts new user', () => {
    it('should insert a user into the database', done => {
      createUser(user)
        .then(user => {
          // console.log(user)
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

  describe('findUser', () => {
    it('should find a user', done => {
      createUser(user)
        .then(user => {
          findUserByLgId(user.lg_id)
            .then(user => {
              console.log(user)
              //TODO SHOULD USER BE AN OBJECT OR AN ARRAY? IT"S SUDDENLY COMING BACK AS AN ARRAY...
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

  describe('updateUser', () => {
    it('should update a user record', done => {
      createUser(user)
        .then(user => {
          updateUserByLgId(user.lg_id, { active_coach: true })
            .then(user => {
              console.log(user)
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
  })

  describe('deleteUser', () => {
    it('should delete a user record', done => {
      createUser(user)
        .then(user => {
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
