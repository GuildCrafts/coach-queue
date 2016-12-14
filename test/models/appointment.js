const {expect, app, chai} = require('../setup')
const {findFreeSchedule} = require('../../models/appointment')
const {busyTimeData} = require('./appointmentTestData')

describe('appointment models', () => {
  describe('change busy Gcal data to available time', () => {
    it.only('should give us free time', done => {
      Promise.resolve(findFreeSchedule(busyTimeData))
        .then( freeTime => {
          expect(freeTime).to.be.a('array')
          done()
        })
    })
  })
})