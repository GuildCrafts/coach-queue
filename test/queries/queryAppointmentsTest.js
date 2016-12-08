const {expect, app, chai, knex} = require('../setup')
const appointmentsData = require('./appointmentData')
const {
  createAppointment,
  findFirstAppointmentByAttendee,
  findFirstAppointmentByCoachId,
  findAllAppointmentByAttendee,
  findAllAppointmentByCoachId,
  deleteAppointmentById} = require('../../database/queryAppointments')
  
describe('Appointment Query', () => {
  const datetime = new Date(2017, 1, 27, 16, 5)

  beforeEach( before_done => {
    let setApptData = () => appointmentsData.forEach(appointment => createAppointment(appointment))

    return Promise.all([
      knex.truncateAllTables(),
      setApptData(),
      before_done()
    ])
  })
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

  describe('one apt by coach_id', () => {
    it('should find an apt by coach_id', done => {
      findFirstAppointmentByCoachId('4321cd')
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
          // console.log(appointment)
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
          expect(appointment[0].attendees).to.eql(['someone_123', 'reallycoolname' ])
          expect(appointment[1].attendees).to.eql(['someone_123', 'aNameIsCool', 'peopleLikeLearning'])
          expect(appointment[0].coach_id).to.eql('1234ab')
          expect(appointment[1].coach_id).to.eql('4321cd')
          expect(appointment[1].description).to.eql('Something here now.')
          expect(appointment[0].description).to.eql('Solve my bug coach.')
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
          expect(appointment[1].attendees).to.eql([ 'somebody_hit', 'aNameIsCool', 'peopleLikeLearning' ])
          expect(appointment[0].description).to.eql('Something here now.')
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

