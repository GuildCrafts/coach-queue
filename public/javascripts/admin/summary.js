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
  moment.duration( moment().diff( moment( created_at )) ).asMinutes() >= THRESHOLD

let localRequests = []

const requestButton = ( request, adminData ) => {
  const label = pastThreshold( request.created_at ) ? 'danger' : 'success'
  const currentEvent = request.events[ request.events.length - 1 ]

  const claimedBy = currentEvent.name === 'claim' ?
    currentEvent.data.by : 'Unclaimed'

  return `
    <a class="btn btn-sm btn-${label} team-button"
      data-coach="${request.goal.coach_id}" data-created-at="${request.created_at}"
      data-toggle="popover" data-trigger="focus"
      data-claimed-by="${claimedBy}"
      data-escalations="${request.events.filter( e => e.name === 'escalate').length}"
      data-claims="${request.events.filter( e => e.name === 'claim').length}"
      data-name="${request.team[ 0 ].name}" data-created-at="${request.events[ 0 ].created_at}"
      data-id="${request.id}"
      title="${request.team[ 0 ].name}">${request.team[ 0 ].name}</a>
  `
}

const eventReceived = ( clear, adminData ) => ({ requests }) => {
  clear()
  localRequests = requests

  requests.forEach( request => {
    const assignedCoach = request.goal.coach_id

    if( pastThreshold( request.created_at )) {
      const el = document.querySelector( `tr.coach-${assignedCoach} td:nth-child(2)` )

      el.innerHTML = el.innerHTML + requestButton( request, adminData ) // + `\n<label class="label label-danger">${request.team[0].name}</label>`
    } else {
      const el = document.querySelector( `tr.coach-${assignedCoach} td:nth-child(3)` )

      el.innerHTML = el.innerHTML + requestButton( request, adminData ) //`\n<label class="label label-success" data-coach="${assignedCoach}" data-created-at="${request.created_at}">${request.team[0].name}</label>`
    }
  })
}

const ageRequests = adminData => () => {
  const requests = Array.from( document.querySelectorAll( '.btn-success' ) )

  requests.forEach( request => {
    if( pastThreshold( request.dataset.createdAt )) {
      const requestId = parseInt( request.dataset.id )
      request.parentNode.removeChild( request )

      const el = document.querySelector( `tr.coach-${request.dataset.coach} td:nth-child(2)` )

      const oldRequest = localRequests.find( r => r.id === requestId )
      el.innerHTML = el.innerHTML + requestButton( oldRequest, adminData )
    }
  })
}

const popoverContent = ({ teams, goal_counts, coaches }) => function() {
  const el = $(this)

  const team = teams.find( t => t.name === el.data('name'))
  const { goal_id } = team

  const goal = goal_counts.find( g => g.goal_id === goal_id )
  const { coach_id } = goal

  const coach = coaches.find( c => c.id === coach_id )

  return `
    <table class="table table-condensed">
      <tr>
        <th>Goal</th>
        <td><a href="${goal.link}" target="_blank">${goal.title}</a></td>
      </tr>
      <tr>
        <th>Claimed By</th>
        <td>${el.data('claimed-by')}</td>
      </tr>
      <tr>
        <th>Claims</th>
        <td>${el.data('claims')}</td>
      </tr>
      <tr>
        <th>Escalations</th>
        <td>${el.data('escalations')}</td>
      </tr>
      <tr>
        <th>Primary Coach</th>
        <td>${coach.handle}</td>
      </tr>
      <tr>
        <th>Created At</th>
        <td>
          ${moment( el.data('created-at') ).format('M/D H:mm')}<br />
          (${moment.duration( moment().diff( moment( el.data('created-at') )) ).humanize()} old)
        </td>
      </tr>
    </table>
  `
}

const setup = ([ adminData, requests ]) => {
  localRequests = requests
  const render = eventReceived( clearEvents( adminData ), adminData )

  addCoachRows( adminData )
  render({ requests })

  socket.emit( 'join', '/events' )
  socket.on( 'event', render )

  setInterval( ageRequests( adminData ), 60000 )

  $('body').popover({
    placement: 'bottom',
    container: 'body',
    html: true,
    selector: '[data-toggle="popover"]',
    content: popoverContent( adminData )
  })
}

const PARAMS = {
  credentials: 'include',
  headers: new Headers({ 'Content-Type': 'application/json' })
}

Promise.all([
  fetch( '/admin/summary/data', PARAMS ).then( result => result.json() ),
  fetch( '/coach/requests', PARAMS ).then( result => result.json() )
]).then( setup )