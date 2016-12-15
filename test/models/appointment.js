const {expect, app, chai, chaiDateTime} = require('../setup')
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
    it('converts Gcal busytimes to Freetime during LG business hours', done => {
      Promise.resolve(findFreeSchedule(busyTimeData))
        .then( freeTime => {
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
            moment.parseZone("2016-12-15T17:30:00.000-08:00").toDate()
          )
          done()
        })

    })
  })

  describe('findNextAppointment', () => {
    it('should find the first available appointment', done => {
      Promise.resolve(findNextAppointment(freeTimeData))
        .then( aptTime => {
          expect(aptTime).to.be.an('array')
          expect(aptTime.length).to.eql(1)
          expect(aptTime[0].start.toDate()).to.equalDate(
            moment.parseZone("2016-12-14T09:10:00.000-08:00").toDate()
          )
          expect(aptTime[0].end.toDate()).to.equalDate(
            moment.parseZone("2016-12-14T09:40:00.000-08:00").toDate()
          )
          done()
        })
    })

    it.only('should find the first available appointment in second slot', done => {
      Promise.resolve(findNextAppointment(freeTimeData2))
        .then( aptTime => {
          console.log('***** result inside the test: ',aptTime)
          expect(aptTime).to.be.an('array')
          expect(aptTime.length).to.eql(1)
          expect(aptTime[0].start.toDate()).to.equalDate(
            moment.parseZone("2016-12-14T09:40:00.000-08:00").toDate()
          )
          expect(aptTime[0].end.toDate()).to.equalDate(
            moment.parseZone("2016-12-14T09:40:00.000-08:00").toDate()
          )
          done()
        })
    })
  })
})