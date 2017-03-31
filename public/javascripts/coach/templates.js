const dataTemplate = ([ key, value ]) => `${key} = ${value}`

const eventTemplate = event => `
      <div class="event">
        <div class="title">${event.name}</div>
        <div class="data">${Object.entries( event.  data ).map( data => dataTemplate( data )).join('')}</div>
      </div> `

const template = request => `
    <div class="ticket-body" data-created-at="${request.created_at}">
      <h1>Request #${request.id}</h1>
      <h4>
        <a href="${request.goal.link}" alt="${request.goal.title}" target="_blank">${request.goal.title}</a>
        <div>-- Team Member(s): <span>${request.players.map( p => p.handle ).join( ', ' )}</span></div>
        <div>-- Assigned Coach: <span>${request.goal.coach}</span></div>
      </h4>
      <h3>Events (${request.events.length}), Current: ${request.events[request.events.length-1].name}</h3>
      <h3>Escalations (${request.escalations})</h3>
      <h3>Requested ${moment(request.created_at).fromNow()}</h3>
      ${request.events.map( event => eventTemplate( event )).join('')}
      <h4 class="ticket-action-buttons">
        <button data-request_id=${request.id} class="claim">Claim</button>
        <button data-request_id=${request.id} class="escalate">Escalate</button>
      </h4>
    </div> `