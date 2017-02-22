import React, {Component} from 'react'
import fetchMethod from './fetchMethod'

export default class SuperSecretUpload extends Component {
  render() {
    return (
      <form encType="multipart/form-data" method="post" action="/upload" >
        <input type="file" name="teams" />
        <button type="submit" />
      </form>
    )
  }
}
