import React from 'react'
import { Stack, Navbar, Container } from 'react-bootstrap'
import SearchComp from './SearchComp.jsx'
import TimerComp from './TimerComp.jsx'

export default class TopStatusUI extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Stack direction="horizontal" id="topStatus">
        <Navbar
          id="statusBar"
          variant="dark"
          bg="secondary"
          fixed="top"
          className="w-100 py-0"
        ></Navbar>
      </Stack>
    )
  }
}
