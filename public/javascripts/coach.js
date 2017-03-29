const socket = io.connect()

const params = body => ({
  credentials: 'include',
  method: 'post',
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

document.querySelector( 'button.claim').addEventListener( 'click', event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params({ request_id, name: 'claim' }))
    .then( _ => window.location.reload( true ) )
})

document.querySelector( 'button.escalate').addEventListener( 'click', event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params({ request_id, name: 'escalate' }))
    .then( _ => window.location.reload( true ) )
})