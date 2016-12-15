const gcal = require('google-calendar')
const moment = require('moment')
const { findUserByHandle } = require('../io/database/users')

const findFreeSchedule = (busyTime) => {
  let dayStartTime = moment().utcOffset("-08:00").startOf('day').add(9, 'h')
  let dayEndTime = moment().utcOffset("-08:00").startOf('day').add(17.5, 'h')
  let currentTime = (process.env.NODE_ENV == 'test') 
    ? moment("2016-12-14T09:00:00.000").utcOffset("-08:00")
    : moment()
  let counter = 0

  return busyTime.reduce((freetimes, currentAppt) => {
    let startTime = moment(currentAppt.start).utcOffset("-08:00")
    let endTime = moment(currentAppt.end).utcOffset("-08:00")

    if(startTime >= currentTime) {
      freetimes.push({start:currentTime, end: startTime})
      currentTime = endTime
    }

    counter ++
    if(busyTime.length === counter){
      freetimes.push({start:currentTime, end:dayEndTime})
    }

    return freetimes
  }, [])
}

//find next available 30 m appointment slot
const findNextAppointment = (freetimes) => {
  let firstFreeTime = []
  let now = moment()
  let aptStart = now.add({m:10})
  let aptEnd = now.add({m:40})
  
  for (let i = 0; i < fretimes.length; i++) {
    let freeStartTime = freetimes[i].start
    let freeEndTime = freetimes[i].end
    
    (aptStart && aptEnd).isBetween(freeStartTime, freeEndTime) 
      ? firstFreeTime.push({start:aptStart, end: aptEnd}) 
      : null
  }
  return firstFreeTime
}

//TODO: insert timeslot into gcal
//TODO: instert timeslot into DB


module.exports = { 
  findFreeSchedule,
  findNextAppointment
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
      // return freetimes
    // }
