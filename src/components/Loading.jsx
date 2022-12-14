import React from 'react'
import { Spinner } from 'react-bootstrap'
import '../spinner.css'

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    if (this.props.isLoading) {
      this.props.toggle(false)
    } else {
      this.props.toggle(true)
    }
  }
  render() {
    return (
      <div
        className="spin"
        style={{ display: this.props.isLoading ? 'flex' : 'none' }}
      >
        <div>
          <Spinner animation="border"></Spinner>
        </div>
        <span>Loading... Please wait...</span>
      </div>
    )
  }
}

export default Loading
