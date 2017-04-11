const dataTemplate = ([ key, value ]) => `<li>${key}: ${value}</li>`

const eventTemplate = event => `
  <li class="list-group-item">
    <em>${event.name}</em>:
    <ul>
      ${Object.entries( event.data ).map( data => dataTemplate( data )).join('')}
    </ul>
  </li>
`

const claimButton = ( claimable, id ) => {
  if ( claimable ) {
    return `<button data-request_id=${id} class="claim btn btn-default">Claim</button>`
  } else {
    return ''
  }
}

const escalateButton = ( escalatable, id ) => {
  if ( escalatable ) {
    return `<button data-request_id=${id} class="escalate btn btn-danger">Escalate</button>`
  } else {
    return ''
  }
}

const queueTemplate = ({ id, goal, created_at, events, players, claimable, escalatable, escalations }, type="default" ) => {
  const currentStatus = {
    claim: 'claimed',
    escalate: 'escalated',
    create: 'created'
  }[ events[ events.length - 1 ].name ]

  return `
    <div class="panel panel-${type}" data-created-at="${created_at}">
      <div class="panel-heading">
        <em>${currentStatus}</em><br />
        <a href="${goal.link}" alt="${goal.title}" target="_blank">
          [#${id}] ${goal.title}
        </a>
        <em><b>created ${moment( created_at ).fromNow()}</b></em>,
        <b>${escalations} escalations</b>
      </div>

      <div class="panel-body">
        <p class="lead">${events[ 0 ].data.question}</p>

        <dl>
          <dt>Team Members</dt>
          <dd>${players.map( p => p.handle ).join( ', ' )}</dd>
          <dt>Assigned Coach</dt>
          <dd>${goal.coach}</dd>
        </dl>
      </div>

      <ul class="list-group">
        ${events.map( event => eventTemplate( event )).join('')}
      </ul>

      <div class="panel-footer">
        ${claimButton( claimable, id )}
        ${escalateButton( escalatable, id )}
      </div>
    </div>
  `
}

const activeRequestTemplate = request => {
  if ( request !== undefined ) {
    return `${queueTemplate( request, 'success' )}`
  } else {
    return ''
  }
}

const goalTemplate = ( title, teams ) => {
  return `
    <div class="panel panel-default">
      <div class="panel-heading">${title}</div>
      <div class="panel-body">${teams.join( ', ' )}</div>
    </div>
  `
}