const socket = io.connect()

const THRESHOLD = 15
const THRESHOLD_UNIT = 'minutes'

//remove after bundling
const CREATE = 'create'
const CLAIM = 'claim'
const ESCALATE = 'escalate'
const CANCEL = 'cancel'
const RESOLVE = 'resolve'

const params = (method, body) => ({
  credentials: 'include',
  method,
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

const load = () =>
  Promise.all([
    fetch( '/coach/teams', params( 'get' ) ).then( result => result.json() ),
    fetch( '/coach/requests', params( 'get' ) ).then( result => result.json() ),
    fetch( '/coach/whoami', params( 'get' )).then( result => result.json() )
  ])

const renderGoals = goals => {
  const groupedGoals = goals.reduce( (memo, goal) => {
    if( memo.goals[ goal.title ] === undefined ) {
      memo.goals[ goal.title ] = []
    }

    if( ! memo.goals[ goal.title ].includes( goal.name )) {
      memo.goals[ goal.title ].push( goal.name )
    }

    if( memo.teams[ goal.name ] === undefined ) {
      memo.teams[ goal.name ] = []
    }

    memo.teams[ goal.name ].push( goal.handle )

    return memo
  }, { goals: {}, teams: {} } )

  document.querySelector( '.team-list' ).innerHTML =
    Object.keys( groupedGoals.goals ).map( title =>
      goalTemplate( title, groupedGoals.goals[ title ], groupedGoals.teams )
    ).join( '\n' )
}

const render = ( goals, userId ) => {

  renderGoals( goals )

  return requests => {
    removeEvents()

    const decoratedSortedRequests = prioritize( visible( active( requests, userId ), userId ))

    const visibleRequests = decoratedSortedRequests.filter( request => request.visible )
    const activeRequests = decoratedSortedRequests.filter( request => request.active )
      .map( request =>
        Object.assign(
          {},
          request,
          { escalatable: !request.events.some( ({ data }) => data.escalated_by === userId )})
      )

    const decorateClaimable = (request, index) =>
      Object.assign( {}, request, { claimable: index === 0 && activeRequests.length === 0 })

    document.querySelector( '.active-requests' )
      .innerHTML = activeRequests.map( request => activeRequestTemplate( request )).join( '\n' )

    document.querySelector( '.ticket-list' ).innerHTML =
      visibleRequests
        .map( decorateClaimable )
        .map( request => queueTemplate( request )).join( '\n' )

    addEvents()
    ageRequests()
  }
}

const ageRequests = () => {
  const requests = Array.from( document.querySelectorAll( '.panel' ) )

  requests.forEach( request => {
    if( isPastThreshold( request.dataset.createdAt )) {
      request.classList.remove( 'panel-default', 'panel-success' )
      request.classList.add( 'panel-danger' )
    }
  })
}

load()
  .then( ([ goals, requests, userId ]) => {
    const renderRequests = render( goals, userId )

    renderRequests( requests )

    socket.emit( 'join', '/events' )
    socket.emit( 'join', '/goals' )

    socket.on( 'event', data => renderRequests( data.requests ))
    socket.on( 'goal', data => renderGoals( data.goals ))

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
}

const claimClick = event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'claim' }))
}

const addEvents = () => {
  buttons( 'button.claim' ).forEach( button =>
    button.addEventListener( 'click', claimClick )
  )

  buttons( 'button.escalate' ).forEach( button =>
    button.addEventListener( 'click', escalationClick )
  )
}
