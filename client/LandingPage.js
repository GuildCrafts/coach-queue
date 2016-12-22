import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SheduleButton from './SheduleButton'
import CoachActivate from './CoachActivate'

const LandingPage = () => (
  <MuiThemeProvider >
    <div className="mui-container">
      <SheduleButton />
      <div>OR</div>
      <CoachActivate />
    </div>
  </MuiThemeProvider>
)

export default LandingPage
