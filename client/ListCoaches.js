import React, {Component} from 'react'

export default class ListCoaches extends Component {
  constructor(props) {
    super(props)
  }
  listItems() {
    const list = this.props.list
    return list.map((item, key) =>
      <li key={key}>{item.github_handle}</li>
    )
  }
  render() {
    return <ul>{this.listItems()}</ul>
  }
}
