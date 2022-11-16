import React from 'react'
import ControlPanelSelectLength from './ControlPanelSelectLength.jsx'
import ControlPanelPageSize from './ControlPanelPageSize.jsx'
import Bonfire from './Bonfire.jsx'
import { Query } from 'firebase/firestore'

class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.handlePSChange = this.handlePSChange.bind(this)
    this.handleSpanChange = this.handleSpanChange.bind(this)
    this.changeQuery = this.changeQuery.bind(this)
    this.state = {
      span: 1,
      pageSize: 25,
      oMap: new Map(),
      aMap: new Map(),
      sMap: new Map(),
      query: new Query(),
      currentPage: 0,
    }
  }

  handlePSChange(Page) {
    this.setState({ pageSize: Page })
  }

  handleSpanChange(Span) {
    this.setState({ span: Span })
  }

  changeQuery(q) {
    this.setState({ query: q })
  }

  render() {
    const span = this.state.span
    const pageSize = this.state.pageSize
    const query = this.state.query
    const oMap = this.state.oMap
    const aMap = this.state.aMap
    const sMap = this.state.sMap
    const cPage = this.state.currentPage
    var b = new Bonfire().Start()
    return (
      <div className="ControlPanel">
        <div className="ControlPanelUpper">
          <ControlPanelSelectLength
            span={span}
            onSpanChange={this.handleSpanChange}
          />
          <ControlPanelPageSize
            pageSize={pageSize}
            onLenChange={this.handlePSChange}
          />
        </div>
        <b
          query={query}
          oMap={oMap}
          aMap={aMap}
          sMap={sMap}
          span={span}
          pageSize={pageSize}
          currentPage={cPage}
          setQ={this.changeQuery}
        />
        <div className="ControlPanelLower"></div>
      </div>
    )
  }
}

export default ControlPanel
