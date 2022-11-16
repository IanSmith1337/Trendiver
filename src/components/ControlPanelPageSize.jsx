import React from 'react'

class ControlPanelPageSize extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.props.onLenChange(event.target.value / 1)
  }

  render() {
    return (
      <label>
        Items per page: <span> </span>
        <select id="listSize" onChange={this.handleChange}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    )
  }
}

export default ControlPanelPageSize
