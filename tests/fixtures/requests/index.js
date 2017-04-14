const moment = require( 'moment' )

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSSSS'
const DEFAULT_COACH_ID = 'test-user-id'
const OTHER_ID = 'not-the-default-coach-id'

const minutesAgo = minutes =>
  moment().subtract( minutes, 'minutes' ).format( TIMESTAMP_FORMAT )

const Factory = {
  request: ({ created_at, escalations, coach_id, events }) => ({
    events: events || [],
    created_at: created_at || moment().format( TIMESTAMP_FORMAT ),
    escalations: escalations || 0,
    goal: { coach_id: coach_id || DEFAULT_COACH_ID }
  })
}

module.exports = { Factory, minutesAgo, DEFAULT_COACH_ID, OTHER_ID }