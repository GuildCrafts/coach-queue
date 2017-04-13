const socket = io.connect()

const addCoachRows = ({ coaches }) =>
  document.querySelector( 'tbody' ).innerHTML = coaches.map( ({ id, handle, counts }) =>
    `
    <tr class="coach-${id}" data-coach-id="${id}">
      <td class="col-md-2">
        <b>${handle}</b><br />
        <label class="label label-info">Teams ${counts.team_count}</label>
        <label class="label label-primary">Players ${counts.player_count}</label>
      </td>
      <td class="col-md-5"></td>
      <td class="col-md-5"></td>
    </tr>
    `
  ).join( '\n' )

const clearEvents = ({ coaches }) => () => {
  coaches.forEach( coach => {
    document.querySelector( `tr.coach-${coach.id} td:nth-child(2)` ).innerHTML = ''
    document.querySelector( `tr.coach-${coach.id} td:nth-child(3)` ).innerHTML = ''
  })
}

const pastThreshold = created_at =>
  moment.duration( moment().diff( moment( created_at )) ).asMinutes() >= 30

const eventReceived = clear => ({ requests }) => {
  clear()

  requests.forEach( request => {
    const assignedCoach = request.goal.coach_id

    if( pastThreshold( request.created_at )) {
      const el = document.querySelector( `tr.coach-${assignedCoach} td:nth-child(2)` )

      el.innerHTML = el.innerHTML + `\n<label class="label label-danger">${request.team[0].name}</label>`
    } else {
      const el = document.querySelector( `tr.coach-${assignedCoach} td:nth-child(3)` )

      el.innerHTML = el.innerHTML + `\n<label class="label label-success" data-coach="${assignedCoach}" data-created-at="${request.created_at}">${request.team[0].name}</label>`
    }
  })
}

const ageRequests = () => {
  const requests = Array.from( document.querySelectorAll( '.label-success' ) )

  requests.forEach( request => {
    if( pastThreshold( request.dataset.createdAt )) {
      request.parentNode.removeChild( request )

      const el = document.querySelector( `tr.coach-${request.dataset.coach} td:nth-child(2)` )

      el.innerHTML = el.innerHTML + `\n<label class="label label-danger">${request.innerText}</label>`
    }
  })
}

const setup = ([ adminData, requests ]) => {
  const render = eventReceived( clearEvents( adminData ))

  addCoachRows( adminData )
  render({ requests })

  socket.emit( 'join', '/events' )
  socket.on( 'event', render )

  setInterval( ageRequests, 60000 )
}

const PARAMS = {
  credentials: 'include',
  headers: new Headers({ 'Content-Type': 'application/json' })
}

Promise.all([
  fetch( '/admin/summary/data', PARAMS ).then( result => result.json() ),
  fetch( '/coach/requests', PARAMS ).then( result => result.json() )
]).then( setup )