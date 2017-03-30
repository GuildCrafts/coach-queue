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

// TODO: On page load, fetch initial batch of requests and render (removing rendering from server)
// according to prioritization algorithm
// TODO: Whenever an event happens, receive request with events through socket and re-render
// according to prioritization algorithm

// Load all teams I'm responseible for
// Load all requests
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
        <span> -- Team Member(s):</span>
        <span>${request.players.map( p => p.handle ).join( ', ' )}</span>
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

const renderTeams = teams => {
  // TODO: Add teams and goals to coach ui
  // teams.forEach( team => console.log( team ))
}

const render = teams => {
  renderTeams( teams )

  return requests => {
    document.querySelector( '.ticket-list.container' )
      .innerHTML = requests.map( request => template( request )).join( '\n' )
  }
}

load()
  .then( ([ teams, requests ]) => {
    // create my render function here
    const renderTeams= render( teams )

    // associate that render function with request receipt
    // socket.on( 'whatever', invoke render with payload, all requests )
    renderTeams( requests )

    socket.emit( 'join', '/events' )
    socket.on( 'event', data => {
      renderTeams( data.requests )
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