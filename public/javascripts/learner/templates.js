const requestTemplate = ({ question, events }) => {

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
      <div class='col-md-6'>
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
      <div>
    </div>
    `
}

const formTemplate = () => `
  <div class='panel panel-default col-md-6'>
    <div class='panel-body'>
      <form class="request">
        <div class="form-group">
          <label for="question">Question:</label>
          <input class="form-control" type="text" id="question" name="question">
          </input>
        </div>
        <button class="btn btn-primary">Submit Request</button>
      </form>
    </div>
  </div>
`
