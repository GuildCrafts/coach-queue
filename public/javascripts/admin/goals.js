const RADIO_SELECTOR = 'form.coach-assignment input[type="radio"]'

const fields = event => {
  const { playerCount, teamCount, goalId } = event.target.dataset
  const { previousId } = document.querySelector( `tr.goal-assignment-${goalId}` ).dataset

  return {
    previousId,
    goalId,
    players: parseInt( playerCount ),
    teams: parseInt( teamCount )
  }
}

const changeCount = ( coachId, players, teams ) => {
  const playerCount = document.querySelector( `.player-count-${coachId}` )
  const teamCount = document.querySelector( `.team-count-${coachId}` )

  playerCount.innerText = parseInt( playerCount.innerText ) + players
  teamCount.innerText = parseInt( teamCount.innerText ) + teams
}

Array.from( document.querySelectorAll( RADIO_SELECTOR )).forEach( radio => {
  radio.addEventListener( 'click', event => {
    const coachId = event.target.value
    const { previousId, goalId, players, teams } = fields( event )

    if( previousId !== '0' ) {
      changeCount( previousId, -1 * players, -1 * teams )
    }

    changeCount( coachId, players, teams )

    document.querySelector( `tr.goal-assignment-${goalId}` ).dataset.previousId = coachId
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

  const data = Array.from( document.querySelectorAll( 'tr.goal-assignment' )).map( tr => tr.dataset.goalId )
    .map( goalId => Array.from( document.querySelectorAll( `input[name=goal-${goalId}]` )).filter( radio => radio.checked )[ 0 ] )
    .reduce( (memo, radio) => {
      if( radio !== undefined ) {
        memo.push({
          goal_id: radio.dataset.goalId,
          coach_id: radio.value
        })
      }

      return memo
    }, [])

  fetch( '/admin/goals', params({ data }))
    .then( _ => window.location = '/admin/goals' )
    .catch( error => alert( error ))
})
