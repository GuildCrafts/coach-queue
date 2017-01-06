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
      coachList:[],
      fetchExcuted: false
    }
  }

  coachList() {
    const path = '/api/v1/coaches/active'
    const callback = coaches => {
      this.setState({
        coachList: coaches,
        fetchExcuted: true
      })
    }
    return fetchMethod('GET', path, null).then(callback)
  }

  renderCoachList() {
    const coaches = this.state.coachList
    return this.state.fetchExcuted
      ? <CoachList coaches={coaches} />
      : null
  }

  render(){
    return <center>
      <ScheduleButton />
      <Link to="/coach_landing">
        <RaisedButton
          label="I'm a Coach"
          fullWidth={true}
          backgroundColor="#9af0e2"
        />
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
