import React, {Component} from 'react'
import {Card, CardText} from 'material-ui/Card'
import moment from 'moment'
import {List, ListItem, makeSelectable} from 'material-ui/List'

export default class CoachList extends Component {
  render() {
    const coaches = this.props.coaches
    const coachList = coaches.map(coach => {
      const githubLink = `https://github.com/${coach.github_handle}`
      return <ListItem
        primaryText={coach.github_handle}
        key={coach.id}
        href={githubLink}
        target="_blank"
      />
    })

    return <List>
        {coachList}
      </List>
  }
}
