import React from 'react'
import { Stack, Navbar, Container } from 'react-bootstrap'
import SearchComp from './SearchComp.jsx'
import TimerComp from './TimerComp.jsx'

export default class BottomStatusUI extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const l = this.props.load
    const u = this.props.up
    const tk = this.props.tk
    return (
      <Stack direction="horizontal">
        <Navbar
          id="statusBar"
          variant="dark"
          bg="secondary"
          className="w-100 py-1 px-2"
        >
          <TimerComp
            isLoading={l}
            nextTime={u}
            timeKey={tk}
            toggle={this.props.toggle}
          />
          <Container></Container>
          <SearchComp />
        </Navbar>
      </Stack>
    )
  }
}
