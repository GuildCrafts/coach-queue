import React, { Component } from 'react'
import fetchMethod from './fetchMethod'
import moment from 'moment'

export default class Statistics extends Component {

  constructor(props) {
    super(props)

    const startOfWeek = moment().startOf( 'week' )

    this.state = {
      startDate: startOfWeek.clone().add({ d: 1, h: 8, m: 30 }),
      endDate: startOfWeek.clone().add({ d: 5, h: 18 }),
      statistics: null
    }
  }

  componentDidMount() {
    this.updateStatistics()
  }

  updateStatistics() {
    const body = {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }

    fetchMethod( 'POST', '/api/v1/analytics', body, statistics => {
      this.setState({ statistics })
    })
  }

  updateDate(event) {
    const direction = event.target.innerHTML == 'Next' ? 7 : -7
    const startDate = moment(this.state.startDate).add(direction, 'days')
    const endDate = moment(this.state.endDate).add(direction, 'days')

    this.setState({startDate, endDate}, this.updateStatistics)
  }

  render() {
    if ( !this.state.statistics ) {
      return <div>Loading...</div>
    }

    const displayDate = this.state.startDate.format('MMMM Do YYYY')
    const {
      totalAppointments,
      totalNumberOfLearners,
      numberOfLearnersRequesting,
      totalNumberOfTeams,
      teamsRequesting,
      percentageOfTeamsRequesting,
      averageSessionsPerProject,
      longestWait,
      averageWait
    } = this.state.statistics

    return (
      <div>
        <h3>Week of: {displayDate}</h3>
        <button onClick={ this.updateDate.bind(this) }>Previous</button>
        <button onClick={ this.updateDate.bind(this) }>Next</button>
        <div>
          Total number of appointments: {totalAppointments}
        </div>
        <div>
          Total number of learners: {totalNumberOfLearners}
        </div>
        <div>
          Number of learners requesting: {numberOfLearnersRequesting}
        </div>
        <div>
          Total number of teams: {totalNumberOfTeams}
        </div>
        <div>
          Number of teams requesting: {teamsRequesting}
        </div>
        <div>
          Percentage of teams requesting: {percentageOfTeamsRequesting}%
        </div>
        <div>
          Average number of sessions per project: {averageSessionsPerProject}
        </div>
        <div>
          Longest wait time (seconds): {longestWait}
        </div>
        <div>
          Average wait (seconds): {averageWait}
        </div>
      </div>
    )
  }

}
