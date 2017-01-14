import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import fetchMethod from './fetchMethod'
import {Link} from 'react-router'

export default class ActivateCoach extends Component {
  constructor() {
    super()
  }

  createCoach() {
    const path = '/api/v1/coaches/active'
    const callback = createdCoachResponse => {
      this.props.updateCoachCallback(createdCoachResponse.coach)
    }
    return fetchMethod('POST', path, null).then(callback)
  }

  activateCoach() {
    const path = `/api/v1/coaches/activate`
    const callback = activateCoach => {
      this.props.updateCoachCallback({active_coach: true})
    }
    return fetchMethod('POST', path, null).then(callback)
  }

  deactivateCoach() {
    const path = `/api/v1/coaches/deactivate`
    const callback = deactivateCoach => {
      this.props.updateCoachCallback({active_coach: false})
    }
    return fetchMethod('POST', path, null).then(callback)
  }

  render() {
    const { createCoach, activeCoach } = this.props
    const activateCoachButton = createCoach
      ? <center>
        <RaisedButton
          onClick={() => this.createCoach()}
          label="Activate"
          primary={true}
          disabled={false}
          fullWidth={true}
        />
      </center>
      : <center>
        <RaisedButton
          onClick={() => this.activateCoach()}
          label="Activate"
          primary={!activeCoach}
          disabled={activeCoach}
          fullWidth={true}
        />
        <RaisedButton
          onClick={() => this.deactivateCoach()}
          label="Deactivate"
          primary={activeCoach}
          disabled={!activeCoach}
          fullWidth={true}
        />
      </center>
   return activateCoachButton
  }
}
