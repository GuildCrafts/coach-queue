const {findUserByHandle} = require('../io/database/users')
const gcal = require('google-calendar')


const findAppointment = () => {
  let timeSlots = []
  findActiveCoaches()
    .then( coaches => {
      coaches.map(coach => 
        timeSlots.push(findFirstApptByCalendarId(coach.calendar_ids, coach.google_token)))
    })
    return timeSlots
}


const findFirstApptByCalendarId = (calendar_ids, google_token) => {
  calendar_ids.map( calendar_id => {
    gcal(google_token).freebusy.query( 
    { 
      items: [{id:`${calendar_id}`}],
      timeMin: new Date(), 
      timeMax: new Date("2016-12-20")
    }, (err, data) => {
      err ? res.send(500,err): res.json(data);
    });
  })
  return [calendar_ids, apptTime]
}

const makeAppointmentOnCal = (apptTime) => {
  createAppointment
}


// module.exports = {
//   makeFirstAppointment
// }
  //is active coaches 1 name long?
    //findFirstApptByHandle(activeCoaches)
    //get their next appointment that fits the appt length
    //create appointment in database
  //else
    //go over active coaches array and call findFirstApptByHandle on each
    //compare and find the soonest slot
    //create soonestappointment in database