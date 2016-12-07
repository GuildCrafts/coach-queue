const {expect, app, chai} = require('../setup')

const {
  createUser, 
  findUserByLgId, 
  updateUserByLgId, 
  deleteUserByLgId,
  createAppointment } = require('../../database/queries')

describe('QUERIES', () => {
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
              expect(user).to.be.a('array')
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

  const datetime = new Date(2017, 1, 27, 16, 5)
  //is this the right way to do the date?? Was giving me problems, failing on type
  //attendees is reading as type array, but is displaying in postico as an object...
  const appointment = {
    coach_id:'1234ab',
    date_time: datetime,
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    attendees: ['someone_123', 'aNameIsCool', 'peopleLikeLearning']
  }

  describe('Inserts new appointment', () => {
    it('should insert a appointment into the database', done => {
      createAppointment(appointment)
        .then(appointment => {
          expect(appointment).to.be.a('object')
          expect(appointment.coach_id).to.eql('1234ab')
          expect(appointment.date_time)
            .to.equalDate(new Date(2017, 1, 27, 16, 5))
          expect(appointment.appointment_length).to.eql(45)
          expect(appointment.description)
            .to.eql("We want a walkthrough for setting up express.")
          expect(appointment.attendees).to.be.a('array')
          expect(appointment.attendees)
            .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
          done()
        })
    })
  })
})
