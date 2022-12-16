import React from 'react'
import '../style/spinner.css'
import Countdown from 'react-countdown'

class LoadingComp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        id="timer"
        style={{
          display: !this.props.isLoading ? 'block' : 'none',
        }}
      >
        {this.props.lastTime > 0 && (
          <Countdown
            date={this.props.nextTime}
            key={this.props.timeKey}
            onComplete={() => {
              console.log('Complete fired.')
              if (!this.props.isLoading) {
                this.props.toggle()
                console.log('toggled')
              }
            }}
          />
        )}
      </div>
    )
  }
}

export default LoadingComp
