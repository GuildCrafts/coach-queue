import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import fetchMethod from './fetchMethod'

export default class ActivateCoach extends Component {
  constructor() {
    super()
    this.state = {
      github_handle: '',
      isCoach: false,
      fetchExcuted: false
    }
  }
  activateCoach() {
    const path = `/api/v1/coaches/active`
    const callback = active => {
      this.setState({isCoach: true, fetchExcuted: true})
    }
    return fetchMethod('POST', path, null).then(callback)
  }

  deactivateCoach() {
    const path = `/api/v1/coaches/active`
    const callback = active => {
      this.setState({isCoach: false, fetchExcuted: true})
    }
    return fetchMethod('DELETE', path, null).then(callback)
  }

  render() {
    const {isCoach} = this.state
    return <center>
      <RaisedButton
        onClick={() => this.activateCoach()}
        label="Activate"
        primary={!isCoach}
        disabled={isCoach}
        fullWidth={true}
      />
      <RaisedButton
        onClick={() => this.deactivateCoach()}
        label="Deactivate"
        primary={isCoach}
        disabled={!isCoach}
        fullWidth={true}
      />
    </center>
  }
}
