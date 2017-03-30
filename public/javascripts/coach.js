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

const render = teams => requests => {
  console.log( teams, requests )

  // get a reference to the container
  // templatize each request (later: prioritization)
  // add to ui
}

load()
  .then( ([ teams, requests ]) => {
    // create my render function here
    const renderTeams = render( teams )

    // associate that render function with request receipt
    // socket.on( 'whatever', invoke render with payload, all requests )
    renderTeams( requests )
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