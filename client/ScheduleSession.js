import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Appointment from './Appointment'
import fetchMethod from './fetchMethod'
import MenteeApptList from './MenteeApptList'
import BottomNavigationLink from './BottomNavigation'
import {Link} from 'react-router'

export default class ScheduleSession extends Component {
  constructor() {
    super()
    this.state = {
      currentAppointments: [],
      menteeAppointments: [],
      requestedMenteeAppts: false,
      requestedSchedule: false,
      createdAppointment: null
    }
  }

  createAppointment() {
    const path = '/calendar/find_next'
    const params = {
      pairs_github_handle: this.refs.mentee_handles.input.value
    }
    const callback = appointment => this.setState({
      requestedSchedule: true,
      createdAppointment: appointment
        ? appointment
        : null
    })
    return fetchMethod('POST', path, params, callback)
  }

  menteeAppointments() {
    const path = '/api/v1/appointments/mentee-schedule'
    const callback = appointments => this.setState({
      requestedMenteeAppts: true,
      menteeAppointments: appointments
        ? appointments
        : null
    })
    return fetchMethod('GET', path, null).then(callback)
  }

  renderAppointmentCard() {
    const createdAppointment = this.state.createdAppointment
    return this.state.requestedSchedule
      ? <Appointment createdAppointment={createdAppointment} />
      : null
  }

  renderMenteeAppointments() {
    const menteeAppointments = this.state.menteeAppointments
    return this.state.requestedMenteeAppts
      ? <MenteeApptList menteeAppointments={menteeAppointments} />
      : null
  }

  render() {
    return <center>
      <TextField
        id="pair-input"
        ref="mentee_handles"
        hintText="Your pair's github name"
      />
      <RaisedButton
        onClick={this.createAppointment.bind(this)}
        label="Request a coach"
        primary={true}
        fullWidth={true}
      />
      <RaisedButton
        onClick={this.menteeAppointments.bind(this)}
        label="My Scheduled Appointments"
        backgroundColor="#c6fff3"
        fullWidth={true}
      />
      <Link to="/">
        <RaisedButton
          label="Back"
          fullWidth={true}
        />
      </Link>
      <div>{this.renderAppointmentCard()}</div>
      <div>{this.renderMenteeAppointments()}</div>
      <BottomNavigationLink  />
    </center>
  }
}
