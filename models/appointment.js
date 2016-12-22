const gcal = require('google-calendar')
const P = require('bluebird')
const gcalP = P.promisifyAll(gcal)
const moment = require('moment')
const { findUserByHandle } = require('../io/database/users')

const findFreeSchedule = (busyTime) => {
  let dayStartTime = moment().utcOffset("-08:00").startOf('day').add(9, 'h')
  let dayEndTime = (process.env.NODE_ENV == 'test')
    ? moment("2016-12-14T17:30:00.000").utcOffset("-08:00")
    : moment().utcOffset("-08:00").startOf('day').add(17.5, 'h')
  let currentTime = (process.env.NODE_ENV == 'test')
    ? moment("2016-12-14T09:00:00.000").utcOffset("-08:00")
    : moment()
  let counter = 0

  if(!Array.isArray(busyTime)) {
    return {start: currentTime, end: dayEndTime}
  }

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
    console.log('your freetimes are:', freetimes)
    return freetimes
  }, [])
}

const findNextAppointment = (freetimes) => {
  let now = (process.env.NODE_ENV == 'test')
    ? moment("2016-12-14T09:00:00.000").utcOffset("-08:00")
    : moment()
  let aptStart = now.clone().add({m:10})
  let aptEnd = now.clone().add({m:40})

  let firstApppointment = {}

  if(!Array.isArray(freetimes)) {
    return {start: aptStart, end: aptEnd}
  }

  for (let i = 0; i < freetimes.length; i++) {
    let startFreeTime = freetimes[i].start
    let endFreeTime = freetimes[i].end

    if (aptStart.isBetween(startFreeTime, endFreeTime)
      && aptEnd.isBetween(startFreeTime, endFreeTime)
    ) {
      firstApppointment.start = aptStart.clone().toDate()
      firstApppointment.end = aptEnd.clone().toDate()
      return firstApppointment
    } else {
      aptStart = freetimes[i + 1].start.clone().add({m: 10})
      aptEnd = freetimes[i + 1].start.clone().add({m: 40})
    }
  }
}

const getAllCoachesNextAppts = (coachesArray, access_token) => {
  const startOfToday = moment().startOf('day').add({h:9})
  const endOfToday = moment().startOf('day').add({h:17.5})
  let endOfDay = moment() > endOfToday
    ? moment().endOf('day').add({h:17.5, ms:1})
    : endOfToday

  let startOfDay = moment().isBetween(endOfToday, moment().endOf('day'))
    ? moment().endOf('day').add({h:9, ms:1})
    : startOfToday

  return P.all(coachesArray.map(coach => {
    const freeBusyP = P.promisifyAll(gcal(access_token).freebusy)
    const calendarId = coach.calendar_ids[0]

    return freeBusyP.queryAsync({
      items: [{id:`${calendarId}`}],
      timeMin: startOfDay,
      timeMax: endOfDay
    })
    .then(coachBusyTime => {
      // console.log(calendarId)
      console.log('YOUR BUSY TIME =======', coachBusyTime.calendars)
      console.dir(coachBusyTime.calendars)
      return findFreeSchedule(coachBusyTime)
    })
    .then(coachFreeTime => {
      return {
        calendarId,
        github_handle: coach.github_handle,
        earliestAppointment: findNextAppointment(coachFreeTime.freeTime)
      }
    })
  }))
}

module.exports = { 
  findFreeSchedule,
  findNextAppointment,
  getAllCoachesNextAppts
}
