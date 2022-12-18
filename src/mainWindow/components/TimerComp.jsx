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
        {this.props.nextTime > 0 && (
          <Countdown
            style={{
              display: !this.props.isLoading ? 'block' : 'none',
            }}
            className="px-1 py-0 my-0"
            date={this.props.nextTime}
            key={this.props.timeKey}
            onComplete={() => {
              console.log('Complete fired.')
              if (!this.props.isLoading) {
                this.props.toggle()
              }
            }}
          ></Countdown>
        )}
      </>
    )
  }
}

export default TimerComp
