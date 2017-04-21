const moment = require( 'moment-timezone' )
const EVENTS = require( '../../../events/requests/constants' )

const STATISTICS = {
  longest_wait: 0,
  total_wait: 0,
  total_claims: 0,
  all_claimed_primary_claims: 0,
}

const COACH_STATS = {
  id: 0,
  primary_claims: 0,
  claimed_primary_claims: 0,
  total_claims: 0,
  cycle: 0
}

const initializeCoachStats = ( coaches, cycle ) =>
  coaches.reduce( (memo, { id }) => {
    memo[ id ] = Object.assign( {}, COACH_STATS, { id, cycle })
    return memo
  }, {} )

const waitTime = ( current, previous ) => {
  const currentTime = moment( current.created_at ).tz('America/Los_Angeles')
  const previousTime = moment( previous.created_at ).tz('America/Los_Angeles')

  const difference = currentTime.diff( previousTime )

  if( previousTime.isBefore( currentTime, 'day' )) {
    return moment.duration( difference ).asSeconds() -
      Math.ceil( moment.duration( difference ).asDays() ) * 15 * 60 * 60
  } else {
    return moment.duration( difference ).asSeconds()
  }
}

const calculate = ([ cycle, coaches, requests ]) => {
  const statistics = Object.assign( {}, STATISTICS, { cycle })
  const coachStats = initializeCoachStats( coaches, cycle )

  requests.forEach( ({ events, goal }) => {
    const { coach_id } = goal

    events.forEach( (event, index) => {
      if( event.name === EVENTS.CLAIM ) {
        const previousEvent = events[ index - 1 ]
        const { claimed_by } = event.data
        const wait = waitTime( event, previousEvent )

        statistics.longest_wait = Math.max( statistics.longest_wait, wait )
        statistics.total_wait += wait
        statistics.total_claims += 1
        coachStats[ claimed_by ].total_claims += 1

        if( claimed_by === coach_id ) {
          statistics.all_claimed_primary_claims += 1
          coachStats[ coach_id ].claimed_primary_claims += 1
        }

        if( previousEvent.name === EVENTS.CREATE ) {
          coachStats[ coach_id ].primary_claims += 1
        }
      }
    })
  })

  return { statistics, coachStats }
}

module.exports = calculate