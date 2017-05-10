const params = (method, body) => ({
  credentials: 'include',
  method,
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

const checkForError = response =>
  Promise.all([ response.ok, response.json() ])
  .then( ([ ok, json ]) => {
    if( ! ok ) {
      throw Error( json.message )
    }
  })
  .catch( error => {
    console.log( error )
    alert( error )
    window.location.reload( true )
  })

const load = () =>
  Promise.all([
    fetch( '/coach/teams', params( 'get' ) ).then( result => result.json() ),
    fetch( '/coach/requests', params( 'get' ) ).then( result => result.json() ),
    fetch( '/coach/whoami', params( 'get' )).then( result => result.json() )
  ])

const renderGoals = ([ players, goals ]) => {
  const g = goals.reduce( (memo, goal) => {
    const teams = players.filter( p => p.goal_id === goal.goal_id )
      .reduce( (pMemo, player) => {
        if( pMemo[ player.name ] === undefined ) {
          pMemo[ player.name ] = []
        }
        pMemo[ player.name ].push( player.handle )

        return pMemo
      }, {} )


    memo[ goal.goal_id ] = Object.assign(
      {}, goal, { teams }
    )

    return memo
  }, {} )

  const goalIds = Object.keys( g )

  let html = `
    <div class="panel panel-default">
      <div class="panel-heading">
        Goal Numbers
      </div>
      <div class="panel-body">
        ${goalIds.map(gid => `<a href="https://jsdev.learnersguild.org/goals/${gid}">${gid}</a>&nbsp;`).join('')}
      </div>
    </div>
  `

  goalIds.forEach( goal_id => {
    html += goalTemplate( g[ goal_id ] )
  })

  document.querySelector( '.team-list' ).innerHTML = html
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

let testNumber = 1
const setupDevTools = _ => {
  const devButton = document.querySelector( '#generate-test' )

  if( devButton !== null ) {
    devButton.addEventListener( 'click', event => {
      event.preventDefault()

      const body = {
        name: 'create',
        question: `test question ${testNumber++}`
      }

      fetch( '/events', params( 'post', body ))
        .then( checkForError )
    })
  }
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
  .then( setupDevTools )

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
  event.target.disabled = true
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'escalate' }))
    .then( checkForError )
}

const claimClick = event => {
  event.target.disabled = true
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'claim' }))
    .then( checkForError )
}

const addEvents = () => {
  buttons( 'button.claim' ).forEach( button =>
    button.addEventListener( 'click', claimClick )
  )

  buttons( 'button.escalate' ).forEach( button =>
    button.addEventListener( 'click', escalationClick )
  )
}