const socket = io.connect()

const THRESHOLD = 15
const THRESHOLD_UNIT = 'minutes'

const CREATE = 'create'
const CLAIM = 'claim'
const ESCALATE = 'escalate'
const CANCEL = 'cancel'
const RESOLVE = 'resolve'

socket.emit( 'join', '/stats' )
socket.on( 'update', data => {
  const container = document.querySelector( '.coach-stats' )

  if( container !== null ) {
    const coachStats = data.coachStats.find(
      coach => coach.handle === container.dataset.handle
    )

    document.querySelector( '.primary-statistics' ).innerHTML = coachStats.primary
    document.querySelector( '.communal-statistics' ).innerHTML = coachStats.communal
  }
})