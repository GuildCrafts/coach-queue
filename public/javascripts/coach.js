const socket = io.connect()

const THRESHOLD = 6
const THRESHOLD_UNIT = 'months'

const params = (method, body) => ({
  credentials: 'include',
  method,
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

const load = () =>
  Promise.all([
    fetch( '/coach/teams', params( 'get' ) ).then( result => result.json() ),
    fetch( '/coach/requests', params( 'get' ) ).then( result => result.json() )
  ])

const isPastThreshold = created_at =>
  moment().subtract( THRESHOLD, THRESHOLD_UNIT ).isAfter( moment( created_at ))

const prioritize = ( requests, goals ) => {
  const pastThreshold = requests.filter( request => isPastThreshold( request.created_at ))
    .sort( (a, b) => moment( a.created_at ).valueOf() - moment( b.created_at ).valueOf() )

  const escalated = requests.filter( request =>
    ! isPastThreshold( request.created_at ) && request.escalations > 0
  )
  .sort( firstBy( (a,b) => b.escalations - a.escalations ).thenBy( 'created_at' ) )

  const removedIds = [
    ...pastThreshold.map( request => request.id ),
    ...escalated.map( request => request.id )
  ]
  const goalIds = goals.map( goal => goal.id )

  const assignedToMe = requests
    .filter( request => ! removedIds.includes( request.id ) )
    .filter( request => goalIds.includes( request.goal.id ))
    .sort( (a, b) => moment( a.created_at ).valueOf() - moment( b.created_at ).valueOf() )

  return [ ...pastThreshold, ...escalated, ...assignedToMe ]
}

const render = goals => {
  return requests => {
    removeEvents()

    document.querySelector( '.ticket-list.container' )
      .innerHTML = prioritize( requests, goals ).map( request => template( request )).join( '\n' )

    addEvents()
    ageRequests()
  }
}

const ageRequests = () => {
  const requests = Array.from( document.querySelectorAll( '.ticket-body' ) )

  requests.forEach( request => {
    if( isPastThreshold( request.dataset.createdAt )) {
      request.classList.add( 'aged' )
    }
  })
}

load()
  .then( ([ goals, requests ]) => {
    const renderRequests = render( goals )

    renderRequests( requests )

    socket.emit( 'join', '/events' )
    socket.on( 'event', data => renderRequests( data.requests ))

    setInterval( ageRequests, 60000 )
  })

const buttons = className => {
  const elements = document.querySelectorAll( className )

  if( elements !== null ) {
    return Array.from( elements )
  } else {
    return []
  }
}

const removeEvents = () => {
  buttons( 'button.claim' ).forEach( button =>
    button.removeEventListener( 'click', claimClick )
  )

  buttons( 'button.escalate' ).forEach( button =>
    button.removeEventListener( 'click', escalationClick )
  )
}

const escalationClick = event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'escalate' }))
    .then( _ => window.location.reload( true ) )
}

const claimClick = event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'claim' }))
    .then( _ => window.location.reload( true ) )
}

const addEvents = () => {
  buttons( 'button.claim' ).forEach( button =>
    button.addEventListener( 'click', claimClick )
  )

  buttons( 'button.escalate' ).forEach( button =>
    button.addEventListener( 'click', escalationClick )
  )
}