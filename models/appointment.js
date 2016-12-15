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
  let now = (process.env.NODE_ENV == 'test') 
    ? moment("2016-12-14T09:00:00.000").utcOffset("-08:00")
    : moment()
  let aptStart = now.clone().add({m:10})
  let aptEnd = now.clone().add({m:40})
  let counter = 0

  return freetimes.reduce((firstApt, currentFreeBlock) => {
    let freeStartTime = currentFreeBlock.start
    let freeEndTime = currentFreeBlock.end

    console.log('----BEFORE THE IF', aptStart, aptEnd)
    if ( aptStart.isBetween(freeStartTime, freeEndTime) 
      && aptEnd.isBetween(freeStartTime, freeEndTime)) {
      console.log('----inside the iffff ', {start:aptStart, end: aptEnd})
      return firstApt.push({start:aptStart, end: aptEnd})
    } 

    console.log(freeApt)

    counter ++
    if (counter > 0 && freeApt.length === 0){
      aptStart = freetimes[counter].start.clone().add({m:10})
      aptEnd = freetimes[counter].start.clone().add({m:40})
      console.log('----inside the else', aptStart, aptEnd)
    }

    console.log('====your answer is: ',firstApt)
    
    return firstApt
    
  }, [])
}

//TODO: insert timeslot into gcal
//TODO: instert timeslot into DB


module.exports = { 
  findFreeSchedule,
  findNextAppointment
  }
