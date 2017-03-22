const socket = io.connect()

document.querySelector( 'form.request' ).addEventListener( 'submit', event => {
  event.preventDefault()

  const body = {
    name: 'create',
    question: document.querySelector( 'input#question' ).value
  }

  fetch( '/events', {
    credentials: 'include',
    method: 'post',
    body: JSON.stringify( body ),
    headers: new Headers({ 'Content-Type': 'application/json' })
  })
    .then( result => result.json() )
    .then( json => console.log( json ))
    .catch( error => console.log( error, error.message ))
})