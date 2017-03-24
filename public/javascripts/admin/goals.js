Array.from( document.querySelectorAll( 'select.coach-selector' )).forEach( select => {
  select.addEventListener( 'change', event => {
    const previousId = event.target.dataset.previousId
    const playerCount = parseInt( event.target.dataset.playerCount )
    const teamCount = parseInt( event.target.dataset.teamCount )

    console.log( event.target.dataset )

    if( previousId !== '0' ) {
      const previousPlayerCount = document.querySelector( `.player-count-${previousId}` )
      const previousTeamCount = document.querySelector( `.team-count-${previousId}` )

      previousPlayerCount.innerText = parseInt( previousPlayerCount.innerText ) - playerCount
      previousTeamCount.innerText = parseInt( previousTeamCount.innerText ) - teamCount
    }

    event.target.dataset.previousId = event.target.value

    // update the table
    const currentPlayerCount = document.querySelector( `.player-count-${event.target.value}` )
    const currentTeamCount = document.querySelector( `.team-count-${event.target.value}` )

    currentPlayerCount.innerText = parseInt( currentPlayerCount.innerText ) + playerCount
    currentTeamCount.innerText = parseInt( currentTeamCount.innerText ) + teamCount
  })
})