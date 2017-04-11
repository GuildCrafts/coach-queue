const socket = io.connect()

const form = document.querySelector( 'form.request' )

const params = ( method, body ) => ({
  credentials: 'include',
  method,
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

const load = () =>
  fetch( '/request', params( 'get' ) ).then( result => result.json() )

const renderRequest = request => {
  const question = request.events[0].data.question

  const status = request.events[ request.events.length - 1 ].name

  const decoratedRequest = request =>
    Object.assign( {}, request, { question, status })

  document.querySelector( '.request.anchor' ).innerHTML = requestTemplate( decoratedRequest(request) )

  addButtonEvents()
}

const renderForm = () => {
  document.querySelector( '.form.anchor' ).innerHTML = formTemplate()

  addFormEvents()
}

load()
  .then( request => {
    if ( request !== null ) {
      renderRequest( request )
    } else {
      renderForm()
    }
  })

const button = className => document.querySelector( className )

const resolveClick = event => {
  event.preventDefault()

  fetch( '/events', params( 'post', { name: 'resolve' }))
    .then( _ => window.location.reload( true ) )
}

const cancelClick = event => {
  event.preventDefault()

  fetch( '/events', params( 'post', { name: 'cancel' }))
    .then( _ => window.location.reload( true ) )
}

const formClick = event => {
  event.preventDefault()

  const body = {
    name: 'create',
    question: document.querySelector( 'input#question' ).value
  }

  fetch( '/events', params( 'post', body ))
    .then( result => result.json() )
    .then( json => window.location.reload( true ))
}

const addFormEvents = () => button( 'form.request' ).addEventListener( 'submit', formClick )

const addButtonEvents = () => {
  button( 'button.resolve' ).addEventListener( 'click', resolveClick )

  button( 'button.cancel' ).addEventListener( 'click', cancelClick )
}
