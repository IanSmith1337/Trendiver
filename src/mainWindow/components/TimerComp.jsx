import React from 'react'
import '../style/spinner.css'
import { Stack } from 'react-bootstrap'
import Countdown from 'react-countdown'

class TimerComp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <span className="text-nowrap pe-1">Next update: </span>
        {this.props.nextTime > 0 && (
          <Countdown
            style={{
              display: !this.props.isLoading ? '' : 'none',
            }}
            className="py-1"
            date={this.props.nextTime}
            key={this.props.timeKey}
            onComplete={() => {
              this.props.getData()
            }}
          ></Countdown>
        )}
      </>
    )
  }
}

export default TimerComp
