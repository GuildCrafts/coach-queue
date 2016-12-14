const {findUserByHandle} = require('../io/database/users')
const gcal = require('google-calendar')
const moment = require('moment')

const findFreeSchedule = (busyTime) => {
  let dayStartTime = moment().startOf('day').add(9, 'h')
  let dayEndTime = moment().startOf('day').add(17.5, 'h')
  let currentTime = moment()
  
  let freeApptTimes = busyTime.reduce((freetimes, currentAppt) => {
    let startTime = moment(currentAppt.start).utcOffset(120)
    let endTime = moment(currentAppt.end).utcOffset(120)

    if (startTime >= currentTime) {
      if (currentTime.isBetween(dayStartTime, dayEndTime)) {
        freetimes.push({start:currentTime, end: startTime})
        currentTime = endTime
        return freetimes
      }
      currentTime = endTime
      return freetimes 
    } else {
      current = endTime
      return freetimes
    }
  }, [])
 
  freeApptTimes.push({start:currentTime, end:dayEndTime})
  return freeApptTimes
}

module.exports = {findFreeSchedule}
