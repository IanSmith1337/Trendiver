import React, { useEffect, useState } from 'react'
import DBReader from './DBReader.jsx'
import SearchComp from './SearchComp.jsx'
import LoadingComp from './LoadingComp.jsx'
import TimerComp from './TimerComp.jsx'
import { Navbar, Container, Stack } from 'react-bootstrap'

export default class MainUI extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const l = this.props.load
    const list = this.props.list
    const pf = this.props.flip
    const cp = this.props.page
    const m = this.props.maps
    return (
      <div id="mainViewport" className="d-flex flex-column flex-fill p-2">
        <LoadingComp isLoading={l}></LoadingComp>
        <DBReader
          isLoading={l}
          list={list}
          pageFlip={pf}
          currentPage={cp}
          maps={m}
        />
      </div>
    )
  }
}
