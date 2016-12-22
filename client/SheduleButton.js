import React, {Component} from 'react'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'

export default class SheduleButton extends Component {
  render() {
    return <Link to="/schedule_session">
        <RaisedButton label="Shedule an Appointment" primary={true}/>
      </Link>
  }
}
