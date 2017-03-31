const socket = io.connect()

// TODO - Implement display business logic according to these rules:

// In my queue, I MUST see:
// Requests with 0 escalations, prioritized by created_at (oldest has highest priority)
// Requests from other coaches that are past the threshold age, or escalated
// Requests I have escalated = we still want to see this, it just blocks us from doing anything else

// I should NOT see:
// Requests from other coaches that are past the threshold age, or escalated that have been claimed

// TODO (prioritization algorithm): Filter requests by:
// 1. assigned to me (a project I am coaching for) with 0 escalations
// 2. not assigned to me, escalated
// 3. not assigned to me, past the threshold age (from creation)

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

const dataTemplate = ([ key, value ]) => `${key} = ${value}`

const eventTemplate = event =>
`
      <div class="event">
        <div class="title">${event.name}</div>
        <div class="data">${Object.entries( event.  data ).map( data => dataTemplate( data )).join('')}</div>
      </div>
`

const template = request =>
  `
    <div class="ticket-body" data-created-at="${request.created_at}">
      <h1>Request #${request.id}</h1>
      <h4>
        <a href="${request.goal.link}" alt="${request.goal.title}" target="_blank">${request.goal.title}</a>
        <div>-- Team Member(s): <span>${request.players.map( p => p.handle ).join( ', ' )}</span></div>
        <div>-- Assigned Coach: <span>${request.goal.coach}</span></div>
      </h4>
      <h3>Events (${request.events.length}), Current: ${request.events[request.events.length-1].name}</h3>
      <h3>Escalations (${request.escalations})</h3>
      <h3>Requested ${moment(request.created_at).fromNow()}</h3>
      ${request.events.map( event => eventTemplate( event )).join('')}
      <h4 class="ticket-action-buttons">
        <button data-request_id=${request.id} class="claim">Claim</button>
        <button data-request_id=${request.id} class="escalate">Escalate</button>
      </h4>
    </div>
  `

const renderGoals = goals => {
  // TODO:  Addgoals and goals to coach ui
  // teams.forEach( team => console.log( team ))
}

const THRESHOLD = 6
const THRESHOLD_UNIT = 'months'

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
  renderGoals( goals )

  return requests => {
    console.log( requests )

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

    const timeoutId = setInterval( ageRequests, 60000 )
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