import React, { useEffect, useState } from 'react'
import ControlPanel from './ControlPanel.jsx'
import SearchComp from './SearchComp.jsx'
import LoadingComp from './LoadingComp.jsx'
import TimerComp from './TimerComp.jsx'
import { Navbar, Container, Stack } from 'react-bootstrap'

export default class UI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      update: 0,
      tk: '',
      loading: true,
    }
    this.handleLoadChange = this.handleLoadChange.bind(this)
    this.handleTKChange = this.handleTKChange.bind(this)
    this.handleUpdateChange = this.handleUpdateChange.bind(this)
  }

  handleLoadChange(nl) {
    this.setState({ loading: nl }, () => {
      console.log('load:' + nl)
    })
  }

  handleTKChange(ntk) {
    this.setState({ tk: ntk }, () => {
      console.log('tk:' + ntk)
    })
  }

  handleUpdateChange(up) {
    this.setState({ update: up }, () => {
      console.log('up:' + up)
    })
  }

  render() {
    const l = this.state.loading
    const u = this.state.update
    const tk = this.state.tk
    return (
      <div id="contents">
        <Stack direction="horizontal">
          <Navbar id="searchBar" variant="dark" bg="secondary">
            <TimerComp
              isLoading={l}
              nextTime={u}
              timeKey={tk}
              toggle={this.handleLoadChange}
            ></TimerComp>
            <SearchComp DB={this.props.DB} />
          </Navbar>
        </Stack>
        <Container fluid>
          <LoadingComp isLoading={l}></LoadingComp>
          <ControlPanel
            isLoading={l}
            lastTime={u}
            setNextTime={this.handleUpdateChange}
            setTimeKey={this.handleTKChange}
            toggle={this.handleLoadChange}
            DB={this.props.DB}
          />
        </Container>
      </div>
    )
  }
}
