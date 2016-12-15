const {expect, app, chai} = require('../setup')
const {findFreeSchedule} = require('../../models/appointment')
const {busyTimeData} = require('./appointmentTestData')

// { start: '2016-12-14T10:30:00Z', end: '2016-12-14T11:30:00Z' },
//   { start: '2016-12-14T15:00:00Z', end: '2016-12-14T16:00:00Z' },

describe('Appointment Models: ', () => {
  describe('Change Gcal busy time to available time.', () => {
    it('should give us free time', done => {
      Promise.resolve(findFreeSchedule(busyTimeData))
        .then( freeTime => {
          expect(freeTime).to.be.an('array')
          expect(freeTime.length).to.eql(2)
          expect(freeTime[0]).to.be.an('object')
          expect(freeTime[1]).to.be.an('object')
          expect(freeTime[0]).to.eql({ 
            start: moment("2016-12-14T09:00:00.000"), 
            end: moment("2016-12-14T10:30:00.000") 
          })
          expect(freeTime[1]).to.eql({ 
            start: moment("2016-12-14T11:30:00.000"), 
            end: moment("2016-12-14T15:00:00.000") 
          })
          expect(freeTime[2]).to.eql({ 
            start: moment("2016-12-14T16:00:00.000"), 
            end: moment("2016-12-14T17:30:00.000") 
          })
          done()
        })
    })
  })
})