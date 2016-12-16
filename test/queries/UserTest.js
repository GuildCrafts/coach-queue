const {expect, app, chai} = require('../setup')
const {user} = require('./testingData')
const {
  createUser, 
  findUserByHandle,
  updateUserByHandle,
  deleteUserByHandle,
  getActiveCoaches,
  activateCoach,
  deactivateCoach
} = require('../../io/database/users')

describe('queryUsers', () => {
  Promise.all([
    createUser(user[0]),
    createUser(user[1])
  ])
  .then(user => {
    describe('findUser', () => {
      it('should find a user', done => {
        findUserByHandle(user[0].github_handle)
          .then(user => {
            expect(user).to.be.a('object')
            expect(user.github_handle).to.eql('ImALeafyPlant')
            expect(user.can_coach).to.eql(true)
            expect(user.active_calender).to.eql(true)
            expect(user.active_coach).to.eql(false)
            expect(user.google_token).to.eql("A_TOKEN")
            expect(user.email).to.eql("flowers@gmail.netorg")
            expect(user.calendar_ids).to.be.a('array')
            expect(user.calendar_ids).to.eql(['flowers@gmail.netorg', 'flowers@lguild.net'])
            done()
          })
      })
    })

    describe('updateUser', () => {
      it('should update a user record', done => {
        updateUserByHandle(user[0].github_handle, { active_coach: true })
          .then(user => {
            expect(user).to.be.a('object')
            expect(user.github_handle).to.eql('ImALeafyPlant')
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
            let coach = coaches[0]
            expect(coach).to.be.a('object')
            expect(coach.github_handle).to.eql('ImALeafyPlant')
            expect(coach.can_coach).to.eql(true)
            expect(coach.active_calender).to.eql(true)
            expect(coach.active_coach).to.eql(true)
            expect(coach.google_token).to.eql("A_TOKEN")
            expect(coach.email).to.eql("flowers@gmail.netorg")
            expect(coach.calendar_ids).to.be.a('array')
            expect(coach.calendar_ids).to.eql(['flowers@gmail.netorg', 'flowers@lguild.net'])
            done()
          })
      })
    })

    describe('Activate a coach', () => {
      it('should activate a coach', done => {
        activateCoach('GoSammyGo')
          .then(coach => {
            expect(coach).to.be.a('object')
            expect(coach.github_handle).to.eql('GoSammyGo')
            expect(coach.can_coach).to.eql(false)
            expect(coach.active_calender).to.eql(false)
            expect(coach.active_coach).to.eql(true)
            expect(coach.google_token).to.eql("ANOTHER_TOKEN")
            expect(coach.email).to.eql("Samsamsam@someemail.org")
            expect(coach.calendar_ids).to.be.a('array')
            expect(coach.calendar_ids).to.eql(['Samsamsam@someemail.org'])
            done()
          })
      })
    })

    describe('Deactivate a coach', () => {
      it('should Deactivate a coach', done => {
        deactivateCoach('GoSammyGo')
          .then(coach => {
            expect(coach).to.be.a('object')
            expect(coach.github_handle).to.eql('GoSammyGo')
            expect(coach.can_coach).to.eql(false)
            expect(coach.active_calender).to.eql(false)
            expect(coach.active_coach).to.eql(false)
            expect(coach.google_token).to.eql("ANOTHER_TOKEN")
            expect(coach.email).to.eql("Samsamsam@someemail.org")
            expect(coach.calendar_ids).to.be.a('array')
            expect(coach.calendar_ids).to.eql(['Samsamsam@someemail.org'])
            done()
          })
      })
    })

    describe('deleteUser', () => {
      it('should delete a user record', done => {
        deleteUserByHandle(user[0].github_handle)
          .then(user => {
            //knex sets no user in db equal to 1
            expect(user).to.eql(1)
            done()
          })
      })
    })
  })
})
