const primary = ({ claimed_primary_claims, primary_claims }) => {
  if( primary_claims === 0 ) {
    return 'N/A'
  } else {
    return Math.floor( 100 * claimed_primary_claims / primary_claims ) + '%'
  }
}

const communal = ({ total_claims, claimed_primary_claims }, all_communal_claims ) => {
  if( all_communal_claims === 0 ) {
    return 'N/A'
  } else {
    return Math.floor( 100 * ( total_claims - claimed_primary_claims ) / all_communal_claims ) + '%'
  }
}

const decorateCoach = all_communal_claims => coach => ({
  handle: coach.handle,
  primary: primary( coach ),
  communal: communal( coach, all_communal_claims )
})

const decorate = ([ statistics, coachStats ]) => {
  const { longest_wait, total_wait, total_claims } = statistics
  const average_wait_time = total_claims > 0 ? Math.floor( total_wait / total_claims ) : 0

  const all_communal_claims = total_claims - coachStats.reduce(
    (memo, stat) => memo + stat.claimed_primary_claims, 0
  )

  return {
    statistics: { longest_wait, average_wait_time },
    coachStats: coachStats.map( decorateCoach( all_communal_claims ))
  }
}

module.exports = decorate