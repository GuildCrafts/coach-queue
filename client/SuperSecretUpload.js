import React, {Component} from 'react'
import fetchMethod from './fetchMethod'

export default class SuperSecretUpload extends Component {
  render() {
    return (
      <form encType="multipart/form-data" method="post" action="/upload" >
        <label>Get the file from https://game.learnersguild.org/reports/projectTeams?chapterName=Oakland&cycleNumber=34</label><br />
        <input type="file" name="teams" />
        <button type="submit" />
      </form>
    )
  }
}
