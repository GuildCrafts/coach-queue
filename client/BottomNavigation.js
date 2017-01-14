import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const userGuide = <FontIcon className="material-icons">User Guide</FontIcon>;
const bugReport = <FontIcon className="material-icons">Report Bugs</FontIcon>;

export default class BottomNavigationLink extends Component {

  render() {
    const reportLink = `https://github.com/GuildCrafts/coach-que/issues`
    const guideLink = `https://github.com/GuildCrafts/coach-que/blob/master/USERGUIDE.md`
    return (
      <div className="BottomNavigationLink">
        <Paper zDepth={1}>
          <BottomNavigation >
            <BottomNavigationItem
              label="Start Here"
              icon={userGuide}
              href={guideLink}
              target="_blank"
            />
            <BottomNavigationItem
              label="Issues"
              icon={bugReport}
              href={reportLink}
              target="_blank"
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}
