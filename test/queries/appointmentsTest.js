const {expect, app, chai} = require('../setup')
const {appointmentsData} = require('./testingData')
const moment = require('moment')
const {
  createAppointment,
  findFirstAppointmentByAttendee,
  findFirstAppointmentByCoachId,
  findAllAppointmentByAttendee,
  findAllAppointmentByCoachId,
  deleteAppointmentById
} = require('../../io/database/appointments')

describe('Appointment DB Queries: ', () => {
  const appointment = {
    appointment_length: 45,
    description: "We want a walkthrough for setting up express.",
    coach_handle: 'ImALeafyPlant',
    mentee_handles: ['someone_123', 'aNameIsCool', 'peopleLikeLearning'],
    appointment_start: moment('2018-01-31 14:00:00').toDate(),
    appointment_end: moment('2018-01-31 14:30:00').toDate(),
  }

  describe('Inserts new appointment', () => {
    it('should insert a appointment into the database', done => {
      createAppointment(appointment)
        .then(newAppointment => {
          console.log(newAppointment)
          expect(newAppointment).to.be.a('object')
          expect(newAppointment.coach_handle).to.eql('ImALeafyPlant')
          expect(newAppointment.appointmentStart)
            .to.equalDate(moment('2018-01-31 14:00:00').toDate())
          expect(newAppointment.appointment_length).to.eql(45)
          expect(newAppointment.description)
            .to.eql("We want a walkthrough for setting up express.")
          expect(newAppointment.mentee_handles).to.be.a('array')
          expect(newAppointment.mentee_handles)
            .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
          expect(newAppointment.appointment_end).to.eql(moment('2018-01-31 14:30:00').toDate())
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
        findFirstAppointmentByCoachId(appointmentList[0].coach_id)
          .then(appointment => {
            expect(appointment).to.be.a('object')
            expect(appointment.coach_id).to.eql('4321cd')
            expect(appointment.date_time)
              .to.equalDate(new Date(2017, 1, 27, 16, 5))
            expect(appointment.appointment_length).to.eql(45)
            expect(appointment.description)
              .to.equal("Something here now.")
            expect(appointment.attendees).to.be.a('array')
            expect(appointment.attendees)
              .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            done()
          })
      })
    })

    describe('one apt by github name', () => {
      it('should find an apt by attendee name', done => {
        findFirstAppointmentByAttendee('someone_123')
          .then(appointment => {
            expect(appointment).to.be.a('object')
            expect(appointment.coach_id).to.eql('4321cd')
            expect(appointment.date_time)
              .to.equalDate(new Date(2017, 1, 27, 16, 5))
            expect(appointment.appointment_length).to.eql(45)
            expect(appointment.description)
              .to.equal("Something here now.")
            expect(appointment.attendees).to.be.a('array')
            expect(appointment.attendees)
              .to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            done()
          })
      })
    })

    describe('all apts by github name', () => {
      it('should find all apt by attendee name', done => {
        findAllAppointmentByAttendee('someone_123')
          .then(appointment => {
            expect(appointment).to.be.a('array')
            expect(appointment[0].coach_id).to.equal('4321cd')
            expect(appointment[0].description).to.eql('Something here now.')
            expect(appointment[0].attendees).to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            expect(appointment[1].coach_id).to.eql('1234ab')
            expect(appointment[1].description).to.eql('Solve my bug coach.')
            expect(appointment[1].attendees).to.eql(['someone_123', 'reallycoolname'])
            expect(appointment[2].coach_id).to.eql('4321cd')
            expect(appointment[2].description).to.eql('Something here now.')
            expect(appointment[2].attendees).to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
            done()
          })
      })
    })

    describe('all apts by coach id', () => {
      it('should find all apt by coach id', done => {
        findAllAppointmentByCoachId('4321cd')
          .then(appointment => {
            expect(appointment).to.be.a('array')
            expect(appointment[0].attendees).to.eql([ 'someone_123', 'aNameIsCool', 'peopleLikeLearning' ])
            expect(appointment[0].description).to.eql('Something here now.')
            expect(appointment[1].attendees).to.eql([ 'somebody_hit', 'aNameIsCool', 'peopleLikeLearning' ])
            expect(appointment[1].description).to.eql('We want a walkthrough for setting up express.')
            done()
          })
      })
    })

    describe('all apts by coach id', () => {
      it('should find all apt by coach id', done => {
        findAllAppointmentByCoachId('4321cd')
          .then(appointment => {
            expect(appointment).to.be.a('array')
            expect(appointment[0].attendees).to.eql([ 'someone_123', 'aNameIsCool', 'peopleLikeLearning' ])
            expect(appointment[0].description).to.eql('Something here now.')
            expect(appointment[1].attendees).to.eql([ 'somebody_hit', 'aNameIsCool', 'peopleLikeLearning' ])
            expect(appointment[1].description).to.eql('We want a walkthrough for setting up express.')
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
