import React, {Component} from 'react'
import { List, ListItem, makeSelectable } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Subheader from 'material-ui/Subheader'

const SelectableList = makeSelectable(List)

export class CoachListing extends Component {
  static PropTypes = {
    children: PropTypes.node.isRequired
    defaultValue: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: users[0],
    }
  }

  handleRequestChange() = (event, index) => {
    this.setState({
      selectedIndex: index,
    })
  }

  render() {
    return (
      <SelectableList
        value={this.state.selectedIndex}
        onchange={this.handleRequestChange}
        >
          {this.props.children}
        </SelectableList>
    )
  }

export default class ListCoaches extends Component {

  render() {
    const { lg_id, github_handle } = this.props

    return (
      <ListItem key={lg_id}
        primaryText={github_handle}
        value=
    )
  }
}
