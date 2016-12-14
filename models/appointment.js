const {findUserByHandle} = require('../io/database/users')
const gcal = require('google-calendar')
const moment = require('moment')


const findAppointment = () => {
  let timeSlots = []
  findActiveCoaches()
    .then( coaches => {
      coaches.map(coach => 
        timeSlots.push(findFirstApptByCalendarId(coach.calendar_ids, coach.google_token)))
    })
    return timeSlots
}


const getGCalSchedule = (calendar_ids, google_token) => {
  calendar_ids.map( calendar_id => {
    gcal(google_token).freebusy.query( 
    { 
      items: [{id:`${calendar_id}`}],
      timeMin: new Date(), 
      timeMax: new Date("2016-12-20")
    }, (err, data) => {
      err ? res.send(500,err): data;
    });
  })
}

const findFreeSchedule = (busyTime) => {
  let dayStartTime = moment().startOf('day').add(9, 'h')
  let dayEndTime = moment().startOf('day').add(17.5, 'h')
  let currentTime = moment()

  let freeApptTimes = busyTime.reduce((freetimes, currentAppt) => {
    let startTime = moment(currentAppt.start)
    let endTime = moment(currentAppt.end)

    if(startTime >= currentTime) {
      freetimes.push({start:currentTime, end: startTime})
      currentTime = endTime
      console.log('==>freetimes ', freetimes)
      return freetimes

    } else if(!currentAppt) {
      console.log('in not currentAppt')
      return freetimes.push({start:currentTime, end: dayEndTime})

    } else {
      console.log('final else')
      current = endTime
      return freetimes
    }
  }, [])
 
  console.log('===================',freeApptTimes)
  return freeApptTimes
}

module.exports = {
  findFreeSchedule,
  getGCalSchedule
}
