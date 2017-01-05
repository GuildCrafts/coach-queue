import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import fetchMethod from './fetchMethod'
import {Link} from 'react-router'
import CoachApptList from './CoachApptList'

export default class CoachLanding extends Component {
  constructor() {
    super()
    this.state = {
      coachAppointments:[],
      fetchExcuted: false
    }
  }

  appointmentList() {
    const path = '/api/v1/appointments/coach-schedule'
    const callback = appointment => {
      this.setState({
        fetchExcuted: true,
        coachAppointments: appointment
      })
    }
    return fetchMethod('GET', path, null).then(callback)
  }

  renderAppointmentList() {
    const coachAppointments = this.state.coachAppointments
    return this.state.fetchExcuted
      ? <CoachApptList coachAppointments={coachAppointments} />
      : null
  }

  render(){
    return <center>
      <Link to="/google/auth" target="_blank">
        <RaisedButton label="Login to Google Calendar" />
      </Link>
      <div></div>
      <RaisedButton label="See Your Appointments"
        onClick={this.appointmentList.bind(this)}
      />
      <div>{this.renderAppointmentList()}</div>
    </center>
  }
}
