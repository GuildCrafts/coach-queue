import React, {Component}  from 'react'
import ScheduleButton from './ScheduleButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router'
import fetchMethod from './fetchMethod'
import CoachList from './CoachList'

export default class LandingPage extends Component {
  constructor() {
    super()
    this.state = {
      coachesList:[],
      fetchExecuted: false
    }
  }

  coachList() {
    const path = '/api/v1/coaches/active'
    const callback = coaches => {
      this.setState({
        coachesList: coaches,
        fetchExecuted: true
      })
    }
    return fetchMethod('GET', path, null).then(callback)
  }

  renderCoachList() {
    const { coachesList, fetchExecuted } = this.state
    return fetchExecuted
      ? <CoachList coaches={coachesList} />
      : null
  }

  render() {
    return <center>
      <ScheduleButton />
      <Link to={"/coach_landing"} >
        <RaisedButton
          label="I'm a Coach"
          fullWidth={true}
          backgroundColor="#9af0e2"/>
      </Link>
      <RaisedButton
        label="Who's coaching?"
        onClick={this.coachList.bind(this)}
        fullWidth={true}
      />
      <div>{this.renderCoachList()}</div>
    </center>
  }
}
