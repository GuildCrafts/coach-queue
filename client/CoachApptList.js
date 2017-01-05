import React, {Component} from 'react'
import {Card, CardText} from 'material-ui/Card'
import moment from 'moment'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class CoachApptList extends Component{

  render() {
    const coachAppointments = this.props.coachAppointments
    const appointmentRows = coachAppointments.sort((apptA, apptB) => {
      return moment(apptB.appointment_end) - moment(apptA.appointment_end)})
        .map(appointment => {
          const startTime = moment(appointment.appointment_start).format('h:mm a')
          const endTime = moment(appointment.appointment_end).format('h:mm a')
          const apptDate = moment(appointment.appointment_start).format('MMMM Do YYYY')
          const mentees = appointment.mentee_handles.join(", ")

          return <TableRow>
            <TableRowColumn>{mentees}</TableRowColumn>
            <TableRowColumn>{appointment.appointment_length}</TableRowColumn>
            <TableRowColumn>{apptDate}</TableRowColumn>
            <TableRowColumn>{startTime}</TableRowColumn>
            <TableRowColumn>{endTime}</TableRowColumn>
          </TableRow>
      })

    return <Table>
      <TableHeader displaySelectAll={false}
        adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Mentees</TableHeaderColumn>
          <TableHeaderColumn>Length</TableHeaderColumn>
          <TableHeaderColumn>Date</TableHeaderColumn>
          <TableHeaderColumn>Start Time</TableHeaderColumn>
          <TableHeaderColumn>End Time</TableHeaderColumn>
        </TableRow>
      </TableHeader>
        <TableBody displayRowCheckbox={false}>{appointmentRows}</TableBody>
    </Table>
  }
}
