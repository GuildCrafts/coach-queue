const {findUserByHandle} = require('../io/database/users')

const findAppointment = (activeCoaches, apptLength) => {
  //is active coaches 1 name long?
    //findFirstApptByHandle(activeCoaches)
    //get their next appointment that fits the appt length
    //create appointment in database
  //else
    //go over active coaches array and call findFirstApptByHandle on each
    //compare and find the soonest slot
    //create soonestappointment in database
}

const findFirstAppointment = (calInfo, apptLength) => {
  //use the google calendar info to find the first appointment that's long enough
}

const findFirstApptByHandle = (handle, apptLength) => {
  findUserByHandle(handle)
    .then(calInfo => findFirstAppointment(calInfo))
}


// module.exports = {
//   makeFirstAppointment
// }