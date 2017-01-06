import React, {Component} from 'react'
import {Card, CardText} from 'material-ui/Card'
import moment from 'moment'
import {List, ListItem, makeSelectable} from 'material-ui/List'

export default class CoachList extends Component {
  render() {
    const coaches = this.props.coaches
    const coachList = coaches.map(coach => <ListItem
        primaryText={coach.github_handle} key={coach.id}
      />)

    return <List>
        {coachList}
      </List>
  }
}
