const {expect, app, chai} = require('../setup')
const {appointmentsData} = require('./testingData')
const moment = require('moment')
const {
  createAppointment,
  findFirstAppointmentByMenteeHandle,
  findFirstAppointmentByCoachId,
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId,
  deleteAppointmentById
} = require('../../io/database/appointments')
const {findUserByHandle} = require('../../io/database/users')

describe('Appointment DB Queries: ', () => {
  const appointment = {
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    coach_handle: 'ImALeafyPlant',
    mentee_handles: ['someone_123', 'aNameIsCool', 'peopleLikeLearning'],
    appointment_start: moment('Wed, 31 Jan 2018 22:00:00 GMT').toDate(),
    appointment_end: moment('Wed, 31 Jan 2018 22:30:00 GMT').toDate(),
  }

  xdescribe('Inserts new appointment', () => {
    it('should insert a appointment into the database', done => {
      createAppointment(appointment)
        .then(newAppointment => {
          console.log(newAppointment)
          expect(newAppointment).to.be.a('object')
          expect(newAppointment.coach_handle).to.eql('ImALeafyPlant')
          expect(newAppointment.appointment_start)
            .to.equal(moment('Wed, 31 Jan 2018 22:30:00 GMT').toDate())
          expect(newAppointment.appointment_length).to.eql(45)
          expect(newAppointment.description)
            .to.eql("We want a walkthrough for setting up express.")
          expect(newAppointment.mentee_handles).to.be.a('array')
          expect(newAppointment.mentee_handles)
            .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
          expect(newAppointment.appointment_end)
            .to.equal(moment('Wed, 31 Jan 2018 22:30:00 GMT').toDate())
          done()
        })
    })
  })

  Promise.all([
    createAppointment(appointmentsData[0]),
    createAppointment(appointmentsData[1]),
    createAppointment(appointmentsData[2])
  ]).then(appointmentList => {
    describe('one apt by coach_id', () => {
      it('should find an apt by coach_id', done => {
        findFirstAppointmentByCoachId(appointmentList[0].coach_handle)
          .then(appointment => {
            expect(appointment).to.be.a('object')
            expect(appointment.coach_handle).to.eql('ImALeafyPlant')
            expect(appointment.appointment_length).to.eql(45)
            expect(appointment.description).to.equal("Something here now.")
            expect(appointment.mentee_handles).to.be.a('array')
            expect(appointment.mentee_handles)
              .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            done()
          })
      })
    })

    describe('one apt by github name', () => {
      it('should find an apt by attendee name', done => {
        findFirstAppointmentByMenteeHandle('someone_123')
          .then(appointment => {
            expect(appointment).to.be.a('object')
            expect(appointment.coach_handle).to.eql('ImALeafyPlant')
            expect(appointment.appointment_start)
              .to.equalDate(new Date(2017, 1, 27, 16, 5))
            expect(appointment.appointment_length).to.eql(45)
            expect(appointment.description)
              .to.equal("Something here now.")
            expect(appointment.mentee_handles).to.be.a('array')
            expect(appointment.mentee_handles)
              .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            done()
          })
      })
    })

    describe('all apts by github name', () => {
      it('should find all apt by attendee name', done => {
        findAllAppointmentByMenteeHandle('someone_123')
          .then(appointment => {
            expect(appointment).to.be.a('array')
            expect(appointment[0].coach_handle).to.equal('ImALeafyPlant')
            expect(appointment[0].description).to.eql('Something here now.')
            expect(appointment[0].mentee_handles).to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            expect(appointment[1].coach_handle).to.eql('GoSammyGo')
            expect(appointment[1].description).to.eql('Solve my bug coach.')
            expect(appointment[1].mentee_handles).to.eql(['someone_123', 'reallycoolname'])
            done()
          })
      })
    })

    describe('all apts by coach id', () => {
      it('should find all apt by coach id', done => {
        findAllAppointmentByCoachId("ImALeafyPlant")
          .then(appointment => {
            expect(appointment).to.be.a('array')
            expect(appointment[0].mentee_handles).to.eql([ 'someone_123', 'aNameIsCool', 'peopleLikeLearning' ])
            expect(appointment[0].description).to.eql('Something here now.')
            expect(appointment[1].mentee_handles).to.eql([ 'somebody_hit', 'aNameIsCool', 'peopleLikeLearning' ])
            expect(appointment[1].description).to.eql('We want a walkthrough for setting up express.')
            done()
          })
      })
    })

    describe('all apts by coach id', () => {
      it('should find all apt by coach id', done => {
        findAllAppointmentByCoachId('kitty_mitty')
          .then(appointment => {
            expect(appointment).to.be.a('array')
            expect(appointment[0].mentee_handles).to.be.a('array')
            expect(appointment[0].mentee_handles).to.eql(['hayward_bay', 'mickey_mouse'])
            expect(appointment[0].description).to.eql('This is a description of appointment.')
            done()
          })
      })
    })

    describe('delete apt', () => {
      it('should delete apt by id', done => {
        deleteAppointmentById('2')
          .then(appointment => {
            //knex sets result in db equal to 1
            expect(appointment).to.eql(1)
            done()
          })
      })
    })
  })
})
