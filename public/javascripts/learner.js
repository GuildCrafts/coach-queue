const form = document.querySelector( 'form.request' )

const params = ( method, body ) => ({
  credentials: 'include',
  method,
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

const load = () =>
  Promise.all([
    fetch( '/request', params( 'get' ) ).then( result => result.json() ),
    fetch( '/learner/coach', params( 'get' ) ).then( result => result.json() )
  ]).then( ([ request, info ]) => ({ request, info: info[ 0 ] }) )

const renderRequest = ( request, info ) => {
  const question = request.events[0].data.question

  const status = request.events[ request.events.length - 1 ].name

  const decoratedRequest = request =>
    Object.assign( {}, request, { question, status })

  document.querySelector( '.request.anchor' ).innerHTML = requestTemplate( decoratedRequest(request), info )

  addButtonEvents()
}

const renderForm = info => {
  document.querySelector( '.form.anchor' ).innerHTML = formTemplate( info )

  addFormEvents()
}

const render = ({ request, info }) => {
  if ( request !== null ) {
    renderRequest( request, info )

    socket.emit( 'join', '/events' )
    socket.on( 'event', ({ requests }) => {
      const learnerRequest = requests.filter( r => r.id === request.id )[ 0 ]

      if( learnerRequest !== undefined ) {
        renderRequest( learnerRequest, info )
      }
    })
  } else {
    renderForm( info )
  }
}

load()
  .then( render )

const button = className => document.querySelector( className )

const resolveClick = event => {
  event.preventDefault()

  fetch( '/events', params( 'post', { name: 'resolve' }))
    .catch( error => { /* no op, reload will take care of it */ })
    .then( _ => window.location.reload( true ) )
}

const cancelClick = event => {
  event.preventDefault()

  fetch( '/events', params( 'post', { name: 'cancel' }))
    .catch( error => { /* no op, reload will take care of it */ })
    .then( _ => window.location.reload( true ) )
}

const formClick = event => {
  event.preventDefault()

  const body = {
    name: 'create',
    question: document.querySelector( 'input#question' ).value,
    location: document.querySelector( 'input#location' ).value
  }

  fetch( '/events', params( 'post', body ))
    .then( result => result.json() )
    .catch( error => { /* no op, reload will take care of it */ })
    .then( _ => window.location.reload( true ))
}

const addFormEvents = () => button( 'form.request' ).addEventListener( 'submit', formClick )

const addButtonEvents = () => {
  button( 'button.resolve' ).addEventListener( 'click', resolveClick )

  button( 'button.cancel' ).addEventListener( 'click', cancelClick )
}
