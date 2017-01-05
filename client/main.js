import ReactDom from 'react-dom'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import LandingPage from './LandingPage'
import ScheduleSession from './ScheduleSession'
import ActivateCoach from './ActivateCoach'

const ReactRouter = () => (
  <MuiThemeProvider >
    <Router history={browserHistory}>
      <Route path="/" component={LandingPage} />
      <Route path="/schedule_session" component={ScheduleSession} />
      <Route path="/activate_coach" component={ActivateCoach} />
    </Router>
  </MuiThemeProvider>

)

ReactDom.render(<ReactRouter />, document.getElementById('root'))
