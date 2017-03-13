import React, {Component} from 'react'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import fetchMethod from './fetchMethod'
import moment from 'moment'

export default class ScheduleButton extends Component {
  constructor(props){
    super(props)

    this.state = {
      disabled: false,
      scheduleLink: '/schedule_session',
      open: false,
      triggerDialog: this.handleClose
    }
  }

  componentDidMount() {
    this.compareTime()
  }

  handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  getUploadTime() {
    return fetchMethod( 'GET', '/api/v1/upload/getUploadTime', null, time => moment(time) )
  }

  getLastFriday() {
    return moment().startOf('week').subtract(2, 'days').add(10, 'hours').toISOString()
  }

  compareTime() {
    this.getUploadTime()
      .then( time => {
        if( moment(time).isBefore(this.getLastFriday() ) ) {
          this.setState({
            disabled: true,
            scheduleLink: '//',
            triggerDialog: this.handleOpen
          })
        }
        else {
          this.setState({
            disabled: false,
            scheduleLink: '/schedule_session',
            triggerDialog: this.handleClose
          })
        }
      })
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <Link onClick={this.state.triggerDialog} to={this.state.scheduleLink}>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          NOPE! Currently, scheduling appointments is NOT available. ¯\_(ツ)_/¯ Check again soon!1!!1
        </Dialog>
        <RaisedButton
          label="Schedule an Appointment"
          primary={true}
          fullWidth={true}
          disabled={this.state.disabled} />
      </Link>
    )
  }
}
