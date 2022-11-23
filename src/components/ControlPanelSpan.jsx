import React from 'react'

class ControlPanelSpan extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.props.onSpanChange(event.target.value / 5)
  }

  render() {
    return (
      <div id="CPLengthSel">
        <label>
          Get hashtags and mentions from the last<span> </span>
          <select id="Length" onChange={this.handleChange}>
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">hour</option>
            <option value="180">3 hours</option>
            <option value="360">6 hours</option>
            <option value="720">12 hours</option>
            <option value="1440">day</option>
            <option value="2880">2 days</option>
            <option value="4320">3 days</option>
            <option value="10080">week</option>
          </select>
          .
        </label>
      </div>
    )
  }
}

export default ControlPanelSpan