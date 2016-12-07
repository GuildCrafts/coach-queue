const {expect, app, chai} = require('../setup')

const {
  createAppointment,
  findFirstAppointmentByAttendee,
  findFirstAppointmentByCoachId} = require('../../database/queryAppointments')

describe('Appointment Query', () => {
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

  describe('finds an appointment', () => {
    it('should find an apt by coach_id', done => {
      createAppointment(appointment)
        .then(appointment => {
          findFirstAppointmentByCoachId(appointment.coach_id)
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

  describe('finds an appointment', () => {
    it('should find an apt by attendee name', done => {
      createAppointment(appointment)
        .then(appointment => {
          findFirstAppointmentByAttendee(appointment.attendees[0])
            .then(appointment => {
              console.log(appointment)
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
})