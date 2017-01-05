import React, {Component} from 'react'
import {Card, CardText} from 'material-ui/Card'
import moment from 'moment'

export default props => {
  const createdAppointment = props.createdAppointment
  let startTime
  let endTime

  if(createdAppointment) {
    startTime = JSON.stringify(
      moment(createdAppointment.appointment_start).format('MMMM Do YYYY, h:mm a')
    )
    endTime = JSON.stringify(
      moment(createdAppointment.appointment_end).format('MMMM Do YYYY, h:mm a')
    )
  }

  if (createdAppointment === null) {
    var unavailable = 'Sorry but no one is availble at this time'
    startTime = 'No times availble'
  }

  return <Card>
      <blockquote></blockquote>
      <CardText>
        <strong>Your appointment is with: </strong>
         {createdAppointment
           ? createdAppointment.coach_handle
           : unavailable
         }
      </CardText>
      <CardText>
        <strong>At: </strong>
        <span>{startTime} - {endTime}</span>
      </CardText>
      <CardText>
        <strong>Attendees:</strong>
        {createdAppointment
          ? createdAppointment.mentee_handles.map((mentee, i) => <div key={i}>{mentee}</div>)
          : ' 0'
        }
      </CardText>
    </Card>
}
