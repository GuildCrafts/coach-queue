const gcal = require('google-calendar')
const P = require('bluebird')
const gcalP = P.promisifyAll(gcal)
const moment = require('moment-timezone');
const { findUserByHandle } = require('../io/database/users')

const findFreeSchedule = (busyTime, currentTime, dayStartTime, dayEndTime) => {
  let counter = 0

  console.log('busyTime===========', busyTime)
  if (busyTime.length == 0) {
    return [{start: currentTime, end: dayEndTime}];
  } else {
    return busyTime.reduce((freetimes, currentAppt) => {
      let busyStartTime = currentAppt.start
      let busyEndTime = currentAppt.end
    
      if(busyStartTime >= currentTime) {
        freetimes.push({start:currentTime, end: busyStartTime})
        currentTime = busyEndTime
      } else if(busyEndTime >= currentTime) {
        currentTime = busyEndTime
      }

      counter++

      //Note: have to do this to accommodate for the time after the final busy slice
      //and the dayEndTime
      if (busyTime.length === counter && !currentTime.isSame(dayEndTime)){
        freetimes.push({start:currentTime, end:dayEndTime})
      }
      console.log('your freetimes are:', freetimes)
      return freetimes
    }, [])
  }
}

const isTimeSlotBigEnough = (timeSlot, lengthOfTimeInMins) => {
  return (timeSlot.end - timeSlot.start) > moment(lengthOfTimeInMins)
}

const findNextAppointment = (freetimes, now) => {
  const appointmentLengthInMins = 30
  // let aptStart = now.clone().add({m:10})
  // let aptEnd = now.clone().add({m:40})

  let firstFreeSlot, i;
  for (i = 0; i < freetimes.length; i++) {
    // TODO: add some buffering so that you can only book appointments every 15 mins
    if (isTimeSlotBigEnough(freetimes[i], appointmentLengthInMins)) {
      break;
    }
  }
  console.log('found i', i, freetimes[i])
  if(i >= freetimes.length) {
    return null
    // no free slot available , maybe return a date
  } else {
    firstFreeSlot = freetimes[i]
    return {start: firstFreeSlot.start,
            end: firstFreeSlot.start.clone().add({m:appointmentLengthInMins})}
  }
}

const getAllCoachesNextAppts = (coachesArray, currentTime) => {
  const workStartHour = 9
  const workEndHour = 23.5

  const dayStartTime = currentTime.clone().startOf('day').add({h:workStartHour})
  const dayEndTime = currentTime.clone().startOf('day').add({h:workEndHour})

  let endOfDay, startOfDay
  if (currentTime > dayEndTime) {
    startOfDay = dayStartTime.clone().add(1, 'day')
    endOfDay = dayEndTime.clone().add(1, 'day')
  } else {
    startOfDay = dayStartTime.clone()
    endOfDay = dayEndTime.clone()
  }
  return P.all(coachesArray.map(coach => {
    const freeBusyP = P.promisifyAll(gcal(coach.google_token).freebusy)
    const calendarId = coach.calendar_ids[0]

    return freeBusyP.queryAsync({
      items: [{id:`${calendarId}`}],
      timeMin: startOfDay,
      timeMax: endOfDay,
      timezone: 'America/Los_Angeles'
    })
    .then(coachBusyTime => {
      return findFreeSchedule(coachBusyTime.calendars[calendarId].busy,
                              currentTime.clone(),
                              startOfDay,
                              endOfDay)
    })
    .then(coachFreeTime => findNextAppointment(coachFreeTime,
                                               currentTime.clone()))
    .then( data => {
      console.log('Data you get back from findNextAppointment', data)
      return {
        calendarId,
        github_handle: coach.github_handle,
        earliestAppointment: data
      }
    })
  }))
}

module.exports = { 
  findFreeSchedule,
  findNextAppointment,
  getAllCoachesNextAppts
}
