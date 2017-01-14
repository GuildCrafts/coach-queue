import React, { Component } from 'react'
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import ActivateCoach from './ActivateCoach'
import CoachApptList from './CoachApptList'
import fetchMethod from './fetchMethod'
import BottomNavigationLink from './BottomNavigation'

export default class CoachLanding extends Component {
  constructor() {
    super()
    this.state = {
      coachAppointments:[],
      fetchExecuted: false,
      clickedOnGoogle: false
    }
  }

  appointmentList() {
    const path = '/api/v1/appointments/coach-schedule'
    const callback = appointments => {
      this.setState({
        fetchExecuted: true,
        coachAppointments: appointments
      })
    }
    return fetchMethod('GET', path, null).then(callback)
  }

  renderAppointmentList() {
    const { coachAppointments, fetchExecuted } = this.state
    return fetchExecuted
      ? <CoachApptList coachAppointments={coachAppointments} />
      : null
  }

  loggedIntoGoogle() {
    this.setState({
      clickedOnGoogle: true
    })
  }

  render(){
    const { clickedOnGoogle } = this.state
    const { coach, updateCoachCallback } = this.props

    let coachOptions

    if (coach === null) {
      if (!clickedOnGoogle) {
        coachOptions = <center>
          <Link to="/google/auth" target="_blank">
            <RaisedButton
              label="Login to Google Calendar"
              fullWidth={true}
              primary={true}
              onClick={this.loggedIntoGoogle.bind(this)}
            />
          </Link>
          <Link to="/">
            <RaisedButton
              label="Back"
              fullWidth={true}
            />
          </Link>
          <BottomNavigationLink />
        </center>
      }
      else if (clickedOnGoogle) {
        coachOptions = <center>
          <ActivateCoach
            createCoach={true}
            updateCoachCallback={updateCoachCallback}
          />
          <Link to="/">
            <RaisedButton
              label="Back"
              fullWidth={true}
            />
          </Link>
          <BottomNavigationLink />
        </center>
      }
    } else {
      coachOptions = <center>
        <ActivateCoach
          activeCoach={coach.active_coach}
          updateCoachCallback={updateCoachCallback}
        />
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
        <BottomNavigationLink />
      </center>
    }
  }
}
