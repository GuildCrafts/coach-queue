const results = document.querySelector( '.test-results' )

const renderErrorMessage = error => {
  const message = document.createElement( 'div' )
  message.classList.add( 'error' )

  results.append( message )
}

const renderResponse = ( json, preface='Response:' ) => {
  const response = document.createElement( 'div' )

  response.innerHTML = `${preface}<br />${JSON.stringify( json, null, '\n' )}`
  results.append( response )
}

Array.from( document.querySelectorAll( '.tests button' )).forEach( button => {
  button.addEventListener( 'click', event => {
    const { method, endpoint } = event.target.dataset
    console.log( method, endpoint )

    fetch( endpoint, { method })
      .then( result => result.json() )
      .then( renderResponse )
      .catch( renderErrorMessage )
  })
})

const socket = io.connect()
socket.on( 'test', data => {
  renderResponse( data, 'Received event test with data:' )
})