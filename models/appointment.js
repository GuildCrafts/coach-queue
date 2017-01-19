const gcal = require('google-calendar')
const P = require('bluebird')
const gcalP = P.promisifyAll(gcal)
const moment = require('moment-timezone');
const { findUserByHandle } = require('../io/database/users')
const { refreshAccessTokenAsync } = require('../io/gateway/google_calendar');

const findFreeSchedule = (busyTime, currentTime, dayStartTime, dayEndTime, coach) => {
  let counter = 0
  // Note: Need to convert to local timezone, otherwise it doesnt book correctly.
  busyTime = busyTime.map((time) => {
    return {
      start: moment(time.start).tz('America/Los_Angeles'),
      end: moment(time.end).tz('America/Los_Angeles')
    }
  })
  console.log(`busyTime=========== ${coach.github_handle}`, busyTime)
  if (busyTime.length == 0 && (dayStartTime.diff(currentTime) >= 0)) {
    return [{start: dayStartTime, end: dayEndTime}]
  } else if (busyTime.length == 0 && (currentTime.diff(dayStartTime) >= 0)) {
    return [{start: currentTime, end: dayEndTime}]
  } else {
    return busyTime.reduce((freetimes, currentAppt) => {
      let busyStartTime = currentAppt.start
      let busyEndTime = currentAppt.end

      if(busyStartTime.diff(currentTime) >= 0) {
        freetimes.push({start:currentTime, end: busyStartTime})
        currentTime = busyEndTime
      } else if(busyEndTime.diff(currentTime) >= 0) {
        currentTime = busyEndTime
      }

      counter++

      //Note: have to do this to accommodate for the time between the final busy slice
      //and the dayEndTime
      if (busyTime.length === counter && !currentTime.isSame(dayEndTime)){
        freetimes.push({start:currentTime, end:dayEndTime})
      }
      console.log(`your freetimes are: ${coach.github_handle}`, freetimes)
      return freetimes
    }, [])
  }
}

const isTimeSlotBigEnough = (timeSlot, lengthOfTimeInMins) => {
  const durationInMinutes = moment.duration(timeSlot.end.diff(timeSlot.start)).asMinutes();
  return durationInMinutes >= lengthOfTimeInMins
}

const findNextAppointment = (freetimes, now, coach) => {
  console.log(`-------> coach ${coach.github_handle} free time is::`, freetimes);
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
  const workEndHour = 17.5

  const dayStartTime = currentTime.clone().startOf('day').tz('America/Los_Angeles').add({h:workStartHour})
  const dayEndTime = currentTime.clone().startOf('day').tz('America/Los_Angeles').add({h:workEndHour})

  let endOfDay, startOfDay
  if (currentTime.diff(dayEndTime) >= 0) {
    startOfDay = dayStartTime.clone().add(1, 'day')
    endOfDay = dayEndTime.clone().add(1, 'day')
    currentTime = startOfDay.clone()
  } else {
    startOfDay = dayStartTime.clone()
    endOfDay = dayEndTime.clone()
  }
  return P.all(coachesArray.map(coach => {
    const freeBusyP = P.promisifyAll(gcal(coach.google_token).freebusy)
    const calendarId = coach.calendar_ids[0]
    const google_token = coach.google_token

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
                              endOfDay,
                              coach)
    })
    .then(coachFreeTime => findNextAppointment(coachFreeTime,
                                               currentTime.clone(),
                                               coach))
    .then( data => {
      console.log(`Data you get back from findNextAppointment ${coach.github_handle}`, data)
      return {
        calendarId,
        google_token,
        github_handle: coach.github_handle,
        google_token: coach.google_token,
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
