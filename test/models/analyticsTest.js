const { expect, app, chai, chaiDateTime } = require( '../setup' )
const moment = require( 'moment' )
const { week1Appointments } = require( './mock_data/analyticsTestData' )
const { createAppointment } = require( '../../io/database/appointments' )
const {
  analysisOfWeek,
  totalAppointmentsByWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  numberOfMentees,
  averageRequestedSessionByMentee,
} = require( '../../models/analytics' )

describe( 'Analytics Models: ', () => {

  describe( 'totalAppointmentsByWeek', () => {
    it( 'returns total number of appointments in a specified week', () => {
      const totalAppointmentsResult = 
        totalAppointmentsByWeek( week1Appointments )
      expect( totalAppointmentsResult ).to.be.a( 'number' )
      expect( totalAppointmentsResult ).to.eql( 10 )
    })
  })

  describe( 'weeklyNumberOfAppointmentsByCoach', () => {
    it( 'returns total number of appointments in a week per coach', () => {
      const weeklyNumberOfAppointments = 
        weeklyNumberOfAppointmentsByCoach( week1Appointments )
      expect( weeklyNumberOfAppointments ).to.be.an( 'object' )
      expect( weeklyNumberOfAppointments )
        .to.eql( { coachQ: 5, secondCoach: 4, lazyCoach: 1 } )
    })
  })

  describe( 'findLongestWaitTime', () => {
    it( 'returns longest wait time for appointments in minutes', () => {
      const longestWaitTimeInMinutes = findLongestWaitTime( week1Appointments )
      expect( longestWaitTimeInMinutes ).to.be.a( 'number' )
      expect( longestWaitTimeInMinutes ).to.eql( 371 )
    })
  })

  describe( 'getAverageWaitTime', () => {
    it( 'returns average wait time for appointments in minutes', () => {
      const averageWaitTimeInMinutes = getAverageWaitTime( week1Appointments )
      expect( averageWaitTimeInMinutes ).to.be.a( 'number' )
      expect( averageWaitTimeInMinutes ).to.eql( 195.5 )
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

  describe( 'analysisOfWeek', () => {
    it( 'returns an object with all analytics data', () => {
      const result = analysisOfWeek( week1Appointments )
      expect( result ).to.be.an( 'object' )
      expect( result ).to.eql({
        totalAppointments: 10,
        appointmentsByCoach: { coachQ: 5, secondCoach: 4, lazyCoach: 1 },
        longestWaitTimeInMinutes: 371,
        averageWaitTimeInMinutes: 195.5,
        totalNumberOfMentees: 11,
        averageSessionByMentee: 1.1
      })
    })
  })

})
