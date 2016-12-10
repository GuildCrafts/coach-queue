import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ListCoaches from './ListCoaches'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      list: []
    }
  }
  componentWillMount(){
    fetch(
      `${process.env.APP_URL || 'http://localhost:3000/api/v1'}/coaches/active`
    )
    .then(response => response.json())
    .then(results => this.setState({list: results.coaches}))
  }
  render() {
    return <MuiThemeProvider>
        <ListCoaches list={this.state.list} />
      </MuiThemeProvider>
  }
}
