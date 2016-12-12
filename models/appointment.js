const {findUserByHandle} = require('../io/database/users')

const getCalendarData= (google_token) => {
  //retrieve google calendar data
}

const findFirstAppointment = (calInfo, apptLength) => {
  //use the google calendar info to find the first appointment that's long enough
}

const findFirstApptByHandle = (handle, apptLength) {
  findUserByHandle(handle)
    .then(user => getCalendarData(user.google_token, apptLength))
    .then(calInfo => findFirstAppointment(calInfo))
}

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

module.exports = {
  makeFirstAppointment
}