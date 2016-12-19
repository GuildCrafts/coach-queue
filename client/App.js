import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {APP_URL} from 'Config'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      list: []
    }
  }
  componentWillMount(){
    fetch(`${APP_URL}/api/v1/coaches/active`)
      .then(response => response.json())
      .then(results => this.setState({list: results.coaches}))
  }
  render() {
    return <MuiThemeProvider>
      </MuiThemeProvider>
  }
}
