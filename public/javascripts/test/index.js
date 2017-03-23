const results = document.querySelector( '.test-results' )

const socket = io.connect()
socket.emit( 'join', '/tests' )

socket.on( 'test', data => {
  renderResponse( data, 'Received event test with data:', 'test-receive' )
})

const clientTest = () => {
  const TEST_DATA = { blarg: 'n stuff' }
  socket.on( 'test-pingback', data => {
    renderResponse( data, 'Received event test-pingback with data:', 'test-receive' )
  })

  renderResponse( TEST_DATA, 'Sending test data as client-test event:' )
  socket.emit( 'client-test', TEST_DATA )
}

const eventTest = () => {
  const name = document.querySelector( '#event-test' ).value

  socket.emit( name, { data: 'test' })
  socket.on( 'test-pingback', data => {
    renderResponse( data, 'Received event test-pingback with data:', 'test-receive' )
  })
}

const testActions = { clientTest, eventTest }

const renderErrorMessage = error => {
  const message = document.createElement( 'div' )
  message.classList.add( 'error' )

  results.append( message )
}

const renderResponse = ( json, preface='Response:', cssClass='test-send' ) => {
  const response = document.createElement( 'div' )
  response.classList.add( cssClass )

  response.innerHTML = `${preface}<br />${JSON.stringify( json, null, '\n' )}`
  results.append( response )
}

Array.from( document.querySelectorAll( '.tests button.fetch' )).forEach( button => {
  button.addEventListener( 'click', event => {
    const { method, endpoint } = event.target.dataset

    fetch( endpoint, { method, credentials: 'include' })
      .then( result => result.json() )
      .then( renderResponse )
      .catch( renderErrorMessage )
  })
})

Array.from( document.querySelectorAll( '.tests button.local' )).forEach( button => {
  button.addEventListener( 'click', event => {
    testActions[ event.target.dataset.action ]()
  })
})
