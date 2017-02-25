const { expect, app, chai, chaiDateTime } = require( '../setup' )
const moment = require( 'moment' )
const { createAppointment } = require( '../../io/database/appointments' )
const {
  week1Appointments,
  week2Appointments
} = require( './mock_data/analyticsTestData' )
const {
  analysisOfWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  numberOfMentees,
  averageRequestedSessionByMentee,
  numberOfTeamsRequesting
} = require( '../../models/analytics' )

describe( 'Analytics Models: ', () => {

  describe( 'weeklyNumberOfAppointmentsByCoach', () => {
    it( 'returns total number of appointments in a week per coach', () => {
      const weeklyNumberOfAppointments =
        weeklyNumberOfAppointmentsByCoach( week1Appointments )
      expect( weeklyNumberOfAppointments ).to.be.an( 'object' )
      expect( weeklyNumberOfAppointments )
        .to.eql( { coachQ: 5, secondCoach: 4, lazyCoach: 1 } )
    })
  })

  describe( 'numberOfTeamsRequesting', () => {
    it( 'should return zero without teams requesting', () => {
      const teamCount = numberOfTeamsRequesting([])
      expect(teamCount).to.equal(0)
    })

    it( 'should return total number of teams requesting appointments', () => {
      const teamCount = numberOfTeamsRequesting( week2Appointments )
      expect(teamCount).to.equal(3)
    })
  })

  describe( 'findLongestWaitTime', () => {
    it( 'returns longest wait time for appointments in seconds', () => {
      const longestWaitTimeInMinutes = findLongestWaitTime( week1Appointments )
      expect( longestWaitTimeInMinutes ).to.be.a( 'number' )
      expect( longestWaitTimeInMinutes ).to.eql( 22260 )
    })
  })

  describe( 'getAverageWaitTime', () => {
    it( 'returns average wait time for appointments in seconds', () => {
      const averageWaitTimeInMinutes = getAverageWaitTime( week1Appointments )
      expect( averageWaitTimeInMinutes ).to.be.a( 'number' )
      expect( averageWaitTimeInMinutes ).to.eql( 11733 )
    })
  })

  describe( 'numberOfMentees', () => {
    it( 'returns total number of mentees requesting a session', () => {
      const totalMentees = numberOfMentees( week1Appointments )
      expect( totalMentees ).to.be.a( 'number' )
      expect( totalMentees ).to.eql( 11 )
    })
  })

  describe( 'averageRequestedSessionByMentee', () => {
    it( 'returns average number of sessions from total weekly sessions', () => {
      const averageRequestedSession =
        averageRequestedSessionByMentee( week1Appointments )
      expect( averageRequestedSession ).to.be.a( 'number' )
      expect( averageRequestedSession ).to.eql( 1.1 )
    })
  })

  // describe( 'analysisOfWeek', () => {
  //   it( 'returns an object with all analytics data', () => {
  //     const result = analysisOfWeek( week1Appointments )
  //     expect( result ).to.be.an( 'object' )
  //     expect( result ).to.eql({
  //       totalAppointments: 10,
  //       appointmentsByCoach: { coachQ: 5, secondCoach: 4, lazyCoach: 1 },
  //       longestWaitTimeInMinutes: 371,
  //       averageWaitTimeInMinutes: 195.5,
  //       totalNumberOfMentees: 11,
  //       averageSessionByMentee: 1.1
  //     })
  //   })
  // })

})
