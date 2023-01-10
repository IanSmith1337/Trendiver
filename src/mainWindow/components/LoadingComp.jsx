import React from 'react'
import { Spinner } from 'react-bootstrap'
import '../style/spinner.css'

class LoadingComp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className="spin"
        id="loading"
      >
        <div>
          <Spinner animation="border"></Spinner>
        </div>
        <span>Loading... Please wait...</span>
      </div>
    )
  }
}

export default LoadingComp
