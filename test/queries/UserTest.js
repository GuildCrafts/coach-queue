const {expect, app, chai} = require('../setup')
const {
  createUser,
  findUserByLgId,
  updateUserByLgId,
  deleteUserByLgId,
  getActiveCoaches,
  activateCoach
} = require('../../io/database/users')
const {user} = require('./testingData')

describe('queryUsers', () => {
  Promise.all([
    createUser(user[0]), 
    createUser(user[1])
  ])
  .then(user => {
    describe('findUser', () => {
      it('should find a user', done => {
        findUserByLgId(user[0].lg_id)
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
        updateUserByLgId(user[0].lg_id, { active_coach: true })
          .then(user => {
            console.log('======>',user)
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

    describe('Get all active coaches', () => {
      it('should get all available active coaches', done => {
        getActiveCoaches()
          .then(coaches => {
            let coach = coaches[1]
            console.log(coaches)
            expect(coach).to.be.a('object')
            expect(coach.lg_id).to.eql('1234ab')
            expect(coach.can_coach).to.eql(true)
            expect(coach.active_calender).to.eql(true)
            expect(coach.active_coach).to.eql(true)
            expect(coach.google_token).to.eql("A_TOKEN")
            done()
          })
      })
    })

    describe('Activate a coach', () => {
      it('should activate a coach', done => {
        activateCoach('nope')
          .then(coach => {
            expect(coach).to.be.a('object')
            expect(coach.lg_id).to.eql('nope')
            expect(coach.can_coach).to.eql(false)
            expect(coach.active_calender).to.eql(false)
            expect(coach.active_coach).to.eql(true)
            expect(coach.google_token).to.eql("nope")
            done()
          })
      })
    })

    describe('deleteUser', () => {
      it('should delete a user record', done => {
        deleteUserByLgId(user[0].lg_id)
          .then(user => {
            //knex sets no user in db equal to 1
            expect(user).to.eql(1)
            done()
          })
      })
    })
  })
})
