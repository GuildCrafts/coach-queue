import React, {Component} from 'react'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'

export default class ScheduleButton extends Component {
  render() {
    return <Link to="/schedule_session">
        <RaisedButton label="Schedule an Appointment" primary={true}/>
      </Link>
  }
}
