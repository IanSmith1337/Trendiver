import React from 'react'
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
      <div
        className="spinner-container"
        style={{ display: this.props.isLoading ? 'block' : 'none' }}
      >
        <div className="spinner"></div>
      </div>
    )
  }
}

export default Loading
