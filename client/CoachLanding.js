import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import fetchMethod from './fetchMethod'
import {Link} from 'react-router'
import CoachApptList from './CoachApptList'
import ActivateCoach from './ActivateCoach'


export default class CoachLanding extends Component {
  constructor() {
    super()
    this.state = {
      coachAppointments:[],
      fetchExcuted: false,
      clickedOnGoogle: false
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

  clickedOnGoogle() {
    this.setState({
      clickedOnGoogle: true
    })
  }

  render(){
    let button
    if(this.state.clickedOnGoogle) {
      button = <ActivateCoach />
    } else {
      button = <Link to="/google/auth" target="_blank">
                <RaisedButton
                  label="Login to Google Calendar"
                  onClick={this.clickedOnGoogle.bind(this)}
                  fullWidth={true}
                  primary={true}
                />
               </Link>
    }
    return <center>
      {button}
      <RaisedButton
        label="See Your Appointments"
        onClick={this.appointmentList.bind(this)}
        fullWidth={true}
        backgroundColor="#c6fff3"
      />
      <Link to="/">
      <RaisedButton
        label="Back"
        fullWidth={true}
      />
    </Link>
      <div>{this.renderAppointmentList()}</div>
    </center>
  }
}
