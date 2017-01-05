import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import fetchMethod from './fetchMethod'
import jwtDecode from 'jwt-decode'

export default class ActivateCoach extends Component {
  constructor() {
    super()
    // const lgJwt = document.cookie.replace('lgJWT=', '').trim()
    // const github_handle = jwtDecode(lgJwt).preferred_username
    this.state = {
      github_handle: '',
      isCoach: false,
      fetchExcuted: false
    }
  }

  findCoach() {
    const {github_handle} = this.state
    const path = `/calendar/init/${github_handle}`
    const callback = active => {
      console.log('active value', active)
      if(!active) {
        this.setState({isCoach: false, fetchExcuted: true})
      } else {
        this.setState({isCoach: true, fetchExcuted: true})
      }
    }

    return fetchMethod('GET', path, null).then(callback)
  }

  render() {
    const {isCoach} = this.state
    const {fetchExcuted} = this.state.fetchExcuted
    if (!!fetchExcuted) {this.findCoach()}

    if(isCoach) {
      return <center>
        <RaisedButton label="Activate" />
        <div>OR</div>
        <RaisedButton label="Deactivate" />
      </center>
    } else {
      return <center>
        <RaisedButton label="Sign Up Coach" />
      </center>
    }
  }
}
