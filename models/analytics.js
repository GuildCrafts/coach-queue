const moment = require( 'moment-timezone' )

const waitTimeDurations = waitTimes => {
  return waitTimes.map( time => {
    const start = moment( time.startTime )
    const created_at = moment( time.created_at )

    return start.diff( created_at, 'seconds' )
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
  const totalSeconds = getWaitTimesArray( appointments )
    .reduce( ( total, time ) => total + time, 0  )

  return totalSeconds / getWaitTimesArray( appointments ).length
}

const numberOfMentees = appointments => {
  const menteesObject = weeklyNumberOfAppointmentsByMentees( appointments )

  return Object.keys( menteesObject ).reduce( ( previous, key ) => {
    return previous += 1
  }, 0)
}

const numberOfTeamsRequesting = appointments =>
  appointments.reduce( (accumulator, currentAppointment) => {
    const teamId = currentAppointment.team_id
    if ( !accumulator.includes(teamId) ) {
      accumulator.push(teamId)
    }
    return accumulator
  }, []).length

const averageRequestedSessionByMentee = appointments => {
  const totalAppointments = appointments.length
  const totalMentees = numberOfMentees( appointments )

  return totalMentees / totalAppointments
}

const analysisOfWeek = data => {

  if ( data.appointments.length === 0 ) {
    return {}
  }

  const totalAppointments = data.appointments.length
  const teamsRequesting = numberOfTeamsRequesting( data.appointments )
  const longestWait = findLongestWaitTime( data.appointments )
  const averageWait = getAverageWaitTime( data.appointments )
  const totalNumberOfTeams = data.teams.length
  const percentageOfTeamsRequesting =
    Math.round((teamsRequesting / totalNumberOfTeams)*10000)/100
  const averageSessionsPerProject =
    Math.round((totalAppointments / totalNumberOfTeams)*100)/100
  const numberOfLearnersRequesting = numberOfMentees( data.appointments )
  const totalNumberOfLearners = data.learners.length

  return {
    totalAppointments,
    teamsRequesting,
    longestWait,
    averageWait,
    totalNumberOfTeams,
    percentageOfTeamsRequesting,
    averageSessionsPerProject,
    numberOfLearnersRequesting,
    totalNumberOfLearners
  }
}

module.exports = {
  analysisOfWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  numberOfMentees,
  averageRequestedSessionByMentee,
  numberOfTeamsRequesting
}
