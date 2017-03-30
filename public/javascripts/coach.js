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
        <div class="data">${Object.entries( event.data ).map( data => dataTemplate( data )).join('')}</div>
      </div>
`

const template = request =>
  `
    <div class="ticket-body">
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

const isPastThreshold = request =>
  moment( request.created_at ).isAfter( moment().subtract( THRESHOLD, THRESHOLD_UNIT ))

const prioritize = ( requests, goals ) => {
  const pastThreshold = requests.filter( isPastThreshold )

  const goalIds = goals.map( goal => goal.id )
  const pastThresholdIds = pastThreshold.map( request => request.id )

  const assignedToMe = requests
    .filter( request => ! pastThresholdIds.includes( request.id ))
    .filter( request => goalIds.includes( request.goal.id ))

/*
If compareFunction(a, b) is less than 0, sort a to a lower index than b, i.e. a comes first.
If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behaviour, and thus not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
If compareFunction(a, b) is greater than 0, sort b to a lower index than a.
*/

  return [ ...pastThreshold, ...assignedToMe ]
    .sort( (a, b) => moment( a.created_at ).valueOf() - moment( b.created_at ).valueOf() )
}

const render = goals => {
  renderGoals( goals )

  return requests => {
    document.querySelector( '.ticket-list.container' )
      .innerHTML = prioritize( requests, goals ).map( request => template( request )).join( '\n' )
  }
}

load()
  .then( ([ goals, requests ]) => {
    // create my render function here
    const renderRequests = render( goals )

    // associate that render function with request receipt
    // socket.on( 'whatever', invoke render with payload, all requests )
    renderRequests( requests )

    socket.emit( 'join', '/events' )
    socket.on( 'event', data => {
      renderRequests( data.requests )
    })
  })


// document.querySelector( 'button.claim').addEventListener( 'click', event => {
//   event.preventDefault()

//   const { request_id } = event.target.dataset

//   fetch( '/events', params({ request_id, name: 'claim' }))
//     .then( _ => window.location.reload( true ) )
// })

// document.querySelector( 'button.escalate').addEventListener( 'click', event => {
//   event.preventDefault()

//   const { request_id } = event.target.dataset

//   fetch( '/events', params({ request_id, name: 'escalate' }))
//     .then( _ => window.location.reload( true ) )
// })