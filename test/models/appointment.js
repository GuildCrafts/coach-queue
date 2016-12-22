const { expect, app, chai, chaiDateTime } = require('../setup')
const moment = require('moment')
const {
  busyTimeData, 
  freeTimeData, 
  freeTimeData2
} = require('./appointmentTestData')
const {
  findFreeSchedule, 
  findNextAppointment 
} = require('../../models/appointment')

describe('Appointment Models: ', () => {
  describe('findFreeSchedule', () => {
    it('converts Gcal busytimes to Freetime during LG business hours', () => {
      const freeTime = findFreeSchedule(busyTimeData)
      expect(freeTime).to.be.an('array')
      expect(freeTime.length).to.eql(3)
      expect(freeTime[0]).to.be.an('object')
      expect(freeTime[1]).to.be.an('object')
      expect(freeTime[0].start.toDate()).to.equalDate(
        moment.parseZone("2016-12-14T09:00:00.000-08:00").toDate()
      )
      expect(freeTime[0].end.toDate()).to.equalDate(
        moment.parseZone("2016-12-14T10:30:00.000-08:00").toDate()
      )
      expect(freeTime[1].start.toDate()).to.equalDate(
        moment.parseZone("2016-12-14T11:30:00.000-08:00").toDate()
      )
      expect(freeTime[1].end.toDate()).to.equalDate(
        moment.parseZone("2016-12-14T15:00:00.000-08:00").toDate()
      )
      expect(freeTime[2].start.toDate()).to.equalDate(
        moment.parseZone("2016-12-14T16:00:00.000-08:00").toDate()
      )
      expect(freeTime[2].end.toDate()).to.equalDate(
        moment.parseZone("2016-12-14T17:30:00.000-08:00").toDate()
      )
    })
  })

  describe('findNextAppointment', () => {
    it('should find the first 30min appointment available', () => {
      const timeSlot = findNextAppointment(freeTimeData)

      expect(timeSlot).to.be.an('object')
      expect(timeSlot).to.eql({
        start: moment.parseZone("2016-12-14T09:10:00.000-08:00").toDate(),
        end: moment.parseZone("2016-12-14T09:40:00.000-08:00").toDate()
      })
    })

    it('should find the first 30min appointment available in nth slot', () => {
      const result = findNextAppointment(freeTimeData2)

      expect(result).to.eql({
        start: moment.parseZone("2016-12-14T16:10:00.000-08:00").toDate(),
        end: moment.parseZone("2016-12-14T16:40:00.000-08:00").toDate()
      })
    })
  })
})