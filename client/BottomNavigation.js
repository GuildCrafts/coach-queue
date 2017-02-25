import React, {Component} from 'react'
import FontIcon from 'material-ui/FontIcon'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconLocationOn from 'material-ui/svg-icons/communication/location-on'

const userGuide = <FontIcon className="material-icons">User Guide</FontIcon>
const bugReport = <FontIcon className="material-icons">Report Bugs</FontIcon>
const statistics = <FontIcon className="material-icons">Statistics</FontIcon>

const BottomNavigationLink = () => (
  <div className="BottomNavigationLink">
    <Paper zDepth={1}>
      <BottomNavigation>
        <BottomNavigationItem
          label="Start Here"
          icon={userGuide}
          href={`https://github.com/GuildCrafts/coach-que/blob/master/USERGUIDE.md`}
          target="_blank" />
        <BottomNavigationItem
          label="Issues"
          icon={bugReport}
          href={`https://github.com/GuildCrafts/coach-que/issues`}
          target="_blank" />
        <BottomNavigationItem
          label="Data"
          icon={statistics}
          href={'/statistics'} />
      </BottomNavigation>
    </Paper>
  </div>
)

export default BottomNavigationLink
