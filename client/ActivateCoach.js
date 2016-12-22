import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'

export default class ActivateCoach extends Component {
  constructor() {
    super()
    this.state = {
      isCoach: false,
      github_handle: 'jusdev89'
    }
  }

  findCoach() {
    const {github_handle} = this.state

    fetch(`${APP_URL}/calendar/init/${github_handle}`)
      .then(response => response.json())
      .then(user => {
        console.log('this is the route for coach', user)
        this.setState({isCoach: true})
      })
  }

  render() {
    this.findCoach()
    return <RaisedButton label="Sign Up Coach" />
  }
}
