const gcal = require('google-calendar')
const moment = require('moment')
const { findUserByHandle } = require('../io/database/users')

const findFreeSchedule = (busyTime) => {
  let dayStartTime = moment().startOf('day').add(9, 'h')
  let dayEndTime = moment().startOf('day').add(17.5, 'h')
  let currentTime = (process.env.NODE_ENV == 'test') 
    ? moment("2016-12-14T09:00:00.000") 
    : moment()


  // { start: '2016-12-14T10:30:00Z', end: '2016-12-14T11:30:00Z' },
  // { start: '2016-12-14T15:00:00Z', end: '2016-12-14T16:00:00Z' },

  
  let freeApptTimes = busyTime.reduce((freetimes, currentAppt) => {
    let startTime = moment(currentAppt.start).utcOffset("-08:00")
    let endTime = moment(currentAppt.end).utcOffset("-08:00")
    console.log('START', startTime)
    console.log('END', endTime)
    console.log('currentAppt', currentAppt)

    if(startTime >= currentTime) {
      console.log('start time is greater than current time')
    }
    
    // if ((startTime && endTime).isBetween(dayEndTime, dayStartTime)) {
    //   return freetimes
    // } 

    // if (startTime >= currentTime) {
    //   if (currentTime.isBetween(dayStartTime, dayEndTime)) {
    //     freetimes.push({start:currentTime, end: startTime})
    //     currentTime = endTime
    //     return freetimes
    //   }
    //   currentTime = endTime
    //   return freetimes 
    // } 

    // else {
    //   current = endTime
    //   return freetimes
    // }
  }, [])
 
  // freeApptTimes.push({start:currentTime, end:dayEndTime})
  return freeApptTimes
}

module.exports = { findFreeSchedule }
