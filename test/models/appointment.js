const { expect, app, chai, chaiDateTime } = require('../setup')
const moment = require('moment')
const { appointmentsData } = require('../queries/testingData')

const {
  busyTimeData,
  freeTimeData,
  freeTimeData2
} = require('./mock_data/appointmentTestData')

const {
  findFreeSchedule,
  findNextAppointment
} = require('../../models/appointment')

const {
  createAppointment,
  findAllAppointmentsByDateRange
} = require( '../../io/database/appointments' )

  // describe('findFreeSchedule', () => {
  //   it('converts Gcal busytimes to Freetime during LG business hours', () => {
  //     const freeTime = findFreeSchedule(busyTimeData)
  //     expect(freeTime).to.be.an('array')
  //     expect(freeTime.length).to.eql(3)
  //     expect(freeTime[0]).to.be.an('object')
  //     expect(freeTime[1]).to.be.an('object')
  //     expect(freeTime[0].start.toDate()).to.equalDate(
  //       moment.parseZone("2016-12-14T09:00:00.000-08:00").toDate()
  //     )
  //     expect(freeTime[0].end.toDate()).to.equalDate(
  //       moment.parseZone("2016-12-14T10:30:00.000-08:00").toDate()
  //     )
  //     expect(freeTime[1].start.toDate()).to.equalDate(
  //       moment.parseZone("2016-12-14T11:30:00.000-08:00").toDate()
  //     )
  //     expect(freeTime[1].end.toDate()).to.equalDate(
  //       moment.parseZone("2016-12-14T15:00:00.000-08:00").toDate()
  //     )
  //     expect(freeTime[2].start.toDate()).to.equalDate(
  //       moment.parseZone("2016-12-14T16:00:00.000-08:00").toDate()
  //     )
  //     expect(freeTime[2].end.toDate()).to.equalDate(
  //       moment.parseZone("2016-12-14T17:30:00.000-08:00").toDate()
  //     )
  //   })
  // })

  // describe('findNextAppointment', () => {
  //   it('should find the first 30min appointment available', () => {
  //     const timeSlot = findNextAppointment(freeTimeData)
  //
  //     expect(timeSlot).to.be.an('object')
  //     expect(timeSlot).to.eql({
  //       start: moment.parseZone("2016-12-14T09:10:00.000-08:00").toDate(),
  //       end: moment.parseZone("2016-12-14T09:40:00.000-08:00").toDate()
  //     })
  //   })
  //
  //   it('should find the first 30min appointment available in nth slot', () => {
  //     const result = findNextAppointment(freeTimeData2)
  //
  //     expect(result).to.eql({
  //       start: moment.parseZone("2016-12-14T16:10:00.000-08:00").toDate(),
  //       end: moment.parseZone("2016-12-14T16:40:00.000-08:00").toDate()
  //     })
  //   })
  // })

  describe( 'findAllAppointmentsByDateRange', () => {
    it('should return all appointments for specified date range', () => {

    const demoDate = appointmentsData[3].appointment_start
    const startDate = moment(demoDate).startOf( 'week' ).add({ d: 1, h: 8, m: 30 })
    const endDate = moment(demoDate).startOf( 'week' ).add({ d: 5, h: 18 })
    const dateRange = { startDate, endDate }

      return Promise.all([
        createAppointment( appointmentsData[3] ),
        createAppointment( appointmentsData[4] ),
        createAppointment( appointmentsData[5] )
      ]).then( _ => {
        return findAllAppointmentsByDateRange( dateRange )
          .then( allAppointments => {
            expect( allAppointments.length ).to.equal(3)
            expect( allAppointments[0].description )
              .to.equal( appointmentsData[4].description )
            expect( allAppointments[1].description )
              .to.equal( appointmentsData[5].description )
            expect( allAppointments[2].description )
              .to.equal( appointmentsData[3].description )
          })
      })
    })
  })
