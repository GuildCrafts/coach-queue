const {findUserByHandle} = require('../io/database/users')

const findAppointment = () => {
  findActiveCoaches()
    .then( coaches => {
      if (coaches.length >1 )
        coaches.map(item => 
          findFirstApptByCalendarId(item.calendar_ids))
    })
  //is active coaches 1 name long?
    //findFirstApptByHandle(activeCoaches)
    //get their next appointment that fits the appt length
    //create appointment in database
  //else
    //go over active coaches array and call findFirstApptByHandle on each
    //compare and find the soonest slot
    //create soonestappointment in database
}


const findFirstApptByCalendarId = (calendar_ids) => {
  calendar_ids.map( calendar_id => findFirstAppointment(calendar_id))
}

const findFirstAppointment = (calendar_id) => {
  //use the google cafindActiveCoaches()lendar info to find the first appointment that's long enough
}

// module.exports = {
//   makeFirstAppointment
// }