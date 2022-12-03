import React from 'react'
import { Spinner } from 'react-bootstrap'
import '../style/spinner.css'

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
      <Spinner
        animation="grow"
        style={{ display: this.props.isLoading ? 'block' : 'none' }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }
}

export default Loading
