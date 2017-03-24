Array.from( document.querySelectorAll( 'select.coach-selector' )).forEach( select => {
  select.addEventListener( 'change', event => {
    const previousId = event.target.dataset.previousId
    const playerCount = parseInt( event.target.dataset.playerCount )
    const teamCount = parseInt( event.target.dataset.teamCount )

    if( previousId !== '0' ) {
      const previousPlayerCount = document.querySelector( `.player-count-${previousId}` )
      const previousTeamCount = document.querySelector( `.team-count-${previousId}` )

      previousPlayerCount.innerText = parseInt( previousPlayerCount.innerText ) - playerCount
      previousTeamCount.innerText = parseInt( previousTeamCount.innerText ) - teamCount
    }

    event.target.dataset.previousId = event.target.value

    const currentPlayerCount = document.querySelector( `.player-count-${event.target.value}` )
    const currentTeamCount = document.querySelector( `.team-count-${event.target.value}` )

    currentPlayerCount.innerText = parseInt( currentPlayerCount.innerText ) + playerCount
    currentTeamCount.innerText = parseInt( currentTeamCount.innerText ) + teamCount
  })
})

const params = body => ({
  credentials: 'include',
  method: 'post',
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

document.querySelector( 'form.coach-assignment' ).addEventListener( 'submit', event => {
  event.preventDefault()

  try {
    const data = Array.from( document.querySelectorAll( 'select.coach-selector' )).map( select => {
      if( select.value === '0' ) {
        throw 'You must assign all goals!'
      }

      return {
        goal_id: select.dataset.goalId,
        coach_id: select.value
      }
    })

    fetch( '/admin/goals', params({ data }))
      .then( _ => window.location = '/admin' )
  } catch( error ) {
    alert( error )
  }
})