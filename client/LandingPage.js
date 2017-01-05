import React from 'react'
import ScheduleButton from './ScheduleButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router'

const LandingPage = () => (
  <center>
    <ScheduleButton />
    <div></div>
    <Link to="/coach_landing">
      <RaisedButton label="I'm a Coach" />
    </Link>
  </center>
)

export default LandingPage
