import React from 'react'
import ControlPanelSelectLength from './ControlPanelSelectLength.jsx'
import ControlPanelPageSize from './ControlPanelPageSize.jsx'

class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.handlePSChange = this.handlePSChange.bind(this)
    this.handleSpanChange = this.handleSpanChange.bind(this)
    this.state = { span: 1, pageSize: 25 }
  }

  handlePSChange(Page) {
    this.setState({ pageSize: Page })
  }

  handleSpanChange(Span) {
    this.setState({ span: Span })
  }

  render() {
    const span = this.state.span
    const pageSize = this.state.pageSize
    return (
      <div className="ControlPanel">
        <ControlPanelSelectLength
          span={span}
          onSpanChange={this.handleSpanChange}
        />
        <ControlPanelPageSize
          pageSize={pageSize}
          onLenChange={this.handlePSChange}
        />
      </div>
    )
  }
}

export default ControlPanel
