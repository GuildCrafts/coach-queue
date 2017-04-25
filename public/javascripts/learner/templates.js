const dataTemplate = ([ key, value ]) => `<li>${key}: ${value}</li>`

const eventTemplate = event => `
  <li class="list-group-item">
    <em>${event.name}</em>:
    <ul>
      ${Object.entries( event.data ).map( data => dataTemplate( data )).join('')}
    </ul>
  </li>
`

const coachColumn = info =>
  `
  <div class='col-md-3'>
    <div class='panel panel-default'>
      <div class='panel-heading'>
        Team ${info.name}
      </div>
      <table class='table'>
        <tr><th>Coach</th><td>${info.coach}</td></tr>
        <tr><th>Goal</th><td><a href='${info.link}' target='_blank'>#${info.id} ${info.title}</a></td></tr>
      </table>
    </div>
  </div>
  `

const statusTemplate = ({ id, goal, created_at, events, players, claimable, escalatable }, type="default" ) => {
  const currentStatus = {
    claim: 'claimed',
    escalate: 'escalated',
    create: 'created'
  }[ events[ events.length - 1 ].name ]

  const escalations = events.filter( event => event.name === 'escalate' ).length

  return `
    <div class="panel panel-${type}" data-created-at="${created_at}">
      <div class="panel-heading">
        <em>${currentStatus}</em><br />

        <em><b>created ${moment( created_at ).fromNow()}</b></em>,
        <b>${escalations} escalations</b><br />
      </div>

      <ul class="list-group">
        ${events.map( event => eventTemplate( event )).join('')}
      </ul>
    </div>
  `
}

const requestTemplate = ( request, info ) => {
  const { question, events } = request

  const currentStatus = {
    'create': 'created',
    'claim': 'claimed',
    'escalate': 'escalated'
  }[ events[ events.length - 1 ].name ]

  const by = events => {
    if ( events[ events.length - 1 ].data.by !== undefined ) {
      return events[ events.length - 1 ].data.by
    } else {
      return ''
    }
  }

  return `
    <h3>Current Request</h3>
    <div class='row'>
      <div class='col-md-5'>
        <div class='panel panel-default'>
          <div class='panel-heading'>
            <div>Request status: ${by( events )} ${currentStatus}
            </div>
          </div>
          <div class='panel-body'>
            <div>Learner question: ${question}
            </div>
          </div>
          <div class='panel-footer'>
            <button class="resolve btn btn-success">Resolve</button>
            <button class="cancel btn btn-danger">Cancel</button>
          </div>
        </div>
      </div>
      ${coachColumn( info )}
      <div class='col-md-4'>
        ${statusTemplate( request )}
      </div>
    </div>
    `
}

const formTemplate = info => `
  <div class='panel panel-default col-md-5'>
    <div class='panel-body'>
      <form class="request">
        <div class="form-group">
          <label for="question">Question:</label>
          <input class="form-control" type="text" id="question" name="question" />
          </input>
        </div>
        <div class="form-group">
          <label for="location">Where are you?</label>
          <input class="form-control" type="text" id="location" name="location" />
        </div>
        <button class="btn btn-primary">Submit Request</button>
      </form>
    </div>
  </div>
  ${coachColumn( info )}
`
