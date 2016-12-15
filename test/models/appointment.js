const {expect, app, chai} = require('../setup')
const {findFreeSchedule} = require('../../models/appointment')
const {busyTimeData} = require('./appointmentTestData')

describe('appointment models', () => {
  describe('change busy Gcal data to available time', () => {
    it('should give us free time', done => {
      Promise.resolve(findFreeSchedule(busyTimeData))
        .then( freeTime => {
          expect(freeTime).to.be.an('array')
          expect(freeTime.length).to.eql(2)
          expect(freeTime[0]).to.be.an('object')
          done()
        })
    })
  })
})