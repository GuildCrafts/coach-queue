import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Appointment from './Appointment'
import fetchMethod from './fetchMethod'

export default class ScheduleSession extends Component {
  constructor() {
    super()
    this.state = {
      currentAppointments: [],
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

  renderAppointmentCard() {
    const createdAppointment = this.state.createdAppointment
    return this.state.requestedSchedule
      ? <Appointment createdAppointment={createdAppointment} />
      : null
  }

  render() {
    const block = <div></div>
    return <center>
      <TextField
        id="pair-input"
        ref="mentee_handles"
        hintText="Your pair's github name"
      />
      {block}
      <RaisedButton
        onClick={() => this.createAppointment()}
        label="Request a coach"
        primary={true}
      />
      <div>{this.renderAppointmentCard()}</div>
    </center>
  }
}
