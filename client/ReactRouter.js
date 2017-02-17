import ReactDom from 'react-dom'
import {Component} from 'react'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import LandingPage from './LandingPage'
import ScheduleSession from './ScheduleSession'
import ActivateCoach from './ActivateCoach'
import CoachLanding from './CoachLanding'
import fetchMethod from './fetchMethod'
import SuperSecretUpload from './SuperSecretUpload'

export default class ReactRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coach: null
    }
  }

  fetchCoach() {
    const path = 'api/v1/coaches/findCoach'
    const callback = coach => {
      this.setState({
        coach: coach
      })
    }
    return fetchMethod('GET', path, null).then(callback)
  }

  updateCoach(coachFields) {
    this.setState({coach: Object.assign({}, this.state.coach, coachFields)})
  }

  componentDidMount() {
    this.fetchCoach()
  }

  render() {
    return <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/schedule_session"
               component={(props, state, params) =>
                 <ScheduleSession coach={this.state.coach} />}/>
        <Route path="/coach_landing"
               component={(props, state, params) =>
                 <CoachLanding coach={this.state.coach}
                               updateCoachCallback={this.updateCoach.bind(this)} />}/>
        <Route path="/upload"
               component={SuperSecretUpload} />
        <Route path="*" component={(props, state, params) => <LandingPage coach={this.state.coach}/>}/>
      </Router>
    </MuiThemeProvider>
  }
}
