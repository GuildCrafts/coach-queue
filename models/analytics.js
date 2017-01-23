const moment = require( 'moment-timezone' )

const waitTimeDurations = waitTimes => {
  return waitTimes.map( time => {
    const start = moment( time.startTime )
    const created_at = moment( time.created_at )

    return start.diff( created_at, 'minutes' )
  })
}

const appointmentWaitTimes = appointments => {
  return appointments.reduce( ( waitTimes, appointment ) => {
    const apptObject = {
      id: appointment.id,
      created_at: appointment.created_at_timestamp,
      startTime: appointment.appointment_start
    }
    
    waitTimes.push( apptObject )

    return waitTimes
  }, [])
}

const weeklyNumberOfAppointmentsByMentees = appointments => {
  return appointments.reduce( ( result, appointment ) => {
    return result.concat( appointment.mentee_handles )
  }, [])
    .reduce( ( menteeNames, name ) => {
      if ( name in menteeNames ) {
        menteeNames[ name ] ++
      }
      else {
        menteeNames[ name ] = 1
      }

      return menteeNames
    }, {})
}

const getWaitTimesArray = appointments => {
  const waitTimes = appointmentWaitTimes( appointments )
  return waitTimeDurations( waitTimes )
}

const totalAppointmentsByWeek = appointments => appointments.length

const weeklyNumberOfAppointmentsByCoach = appointments => {
  return appointments.map( appointment => appointment.coach_handle )
    .reduce( ( coachNames, name ) => {
      if ( name in coachNames ) {
        coachNames[ name ] ++
      } else {
        coachNames[ name ] = 1
      }

      return coachNames
    }, {} )
}

const findLongestWaitTime = appointments => {
  return getWaitTimesArray( appointments )
    .reduce( ( element, secondElement ) =>
      ( element > secondElement ? element : secondElement )
    )
}

const getAverageWaitTime = appointments => {
  const totalMinutes = getWaitTimesArray( appointments )
    .reduce( ( total, time ) => total + time, 0  )
  
  return totalMinutes / getWaitTimesArray( appointments ).length
}

const numberOfMentees = appointments => {
  const menteesObject = weeklyNumberOfAppointmentsByMentees( appointments ) 
  
  return Object.keys( menteesObject ).reduce( ( previous, key ) => {
    return previous += 1
  }, 0)
}

const averageRequestedSessionByMentee = appointments => {
  const totalAppointments = totalAppointmentsByWeek( appointments )
  const totalMentees = numberOfMentees( appointments )

  return totalMentees / totalAppointments
}

const analysisOfWeek = appointments => {

  if ( appointments.length === 0 ) {
    return null
  }

  const totalAppointments = totalAppointmentsByWeek( appointments )
  const appointmentsByCoach = weeklyNumberOfAppointmentsByCoach( appointments )
  const longestWaitTimeInMinutes = findLongestWaitTime( appointments )
  const averageWaitTimeInMinutes = getAverageWaitTime( appointments )
  const totalNumberOfMentees = numberOfMentees( appointments )
  const averageSessionByMentee = averageRequestedSessionByMentee( appointments )
  return {
    totalAppointments,
    appointmentsByCoach,
    longestWaitTimeInMinutes,
    averageWaitTimeInMinutes,
    totalNumberOfMentees,
    averageSessionByMentee
  }
}

module.exports = {
  analysisOfWeek,
  totalAppointmentsByWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  numberOfMentees,
  averageRequestedSessionByMentee
}
