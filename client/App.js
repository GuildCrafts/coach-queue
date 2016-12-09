import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ListCoaches from './ListCoaches'

export default class App extends Component {
  constructor() {
    super()
    this.list = list
  }
  render() {
    return <MuiThemeProvider>
          <ListCoaches list={this.list} />
      </MuiThemeProvider>
  }
}
