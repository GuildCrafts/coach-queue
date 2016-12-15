const {expect, app, chai, chaiDateTime} = require('../setup')
const {findFreeSchedule} = require('../../models/appointment')
const {busyTimeData} = require('./appointmentTestData')
const moment = require('moment')

describe('Appointment Models: ', () => {
  describe('Change Gcal busy time to available time.', () => {
    it('should give us free time', done => {
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
})