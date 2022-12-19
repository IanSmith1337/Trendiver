import React, { useEffect, useState } from 'react'
import RankingComp from './RankingComp.jsx'
import SearchComp from './SearchComp.jsx'
import LoadingComp from './LoadingComp.jsx'
import TimerComp from './TimerComp.jsx'
import { Navbar, Container, Stack } from 'react-bootstrap'
import WindowComp from './WindowComp.jsx'

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
      <WindowComp name="ranking">
        <LoadingComp isLoading={l}></LoadingComp>
        <RankingComp
          isLoading={l}
          list={list}
          pageFlip={pf}
          currentPage={cp}
          maps={m}
        />
      </WindowComp>
    )
  }
}
