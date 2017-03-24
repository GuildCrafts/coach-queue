const socket = io.connect()

const form = document.querySelector( 'form.request' )
const button = document.querySelector( 'button.cancel' )

const params = body => ({
  credentials: 'include',
  method: 'post',
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

if( form !== null ) {
  form.addEventListener( 'submit', event => {
    event.preventDefault()

    const body = {
      name: 'create',
      question: document.querySelector( 'input#question' ).value
    }

    fetch( '/events', params( body ))
      .then( result => result.json() )
      .then( json => {
        window.location.reload( true )
        console.log( json )
      })
      // TODO: async update is desirable; make it work then make it better
      // .then( result => result.json() )
      // .then( json => console.log( json ))
      // .catch( error => console.log( error, error.message ))
  })
} else {
  button.addEventListener( 'click', event => {
    event.preventDefault()

    fetch( '/events', params({ name: 'cancel' }))
      .then( _ => window.location.reload( true ) )
  })
}