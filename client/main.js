import ReactDom from 'react-dom'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import LandingPage from './LandingPage'
import ScheduleSession from './SheduleSession'
import ActivateCoach from './ActivateCoach'

const ReactRouter = () => (
  <Router history={browserHistory}>
    <Route path="/" component={LandingPage} />
    <Route path="/schedule_session" component={ScheduleSession} />
    <Route path="/activate_coach" component={ActivateCoach} />
  </Router>
)

ReactDom.render(<ReactRouter />, document.getElementById('root'))
