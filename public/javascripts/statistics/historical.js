const resetButton = document.querySelector( '.reset' )

if( resetButton !== null ) {
  resetButton.addEventListener( 'click', event => {
    event.target.disabled = true
    event.preventDefault()

    const cycle = event.target.dataset.cycle

    fetch( `/stats/calculate/${cycle}`, { method: 'post', credentials: 'include' })
      .then( result => result.json() )
      .then( _ => window.location.reload( true ))
  })
}