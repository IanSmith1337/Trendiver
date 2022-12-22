import React from 'react'
import RankingComp from './RankingComp.jsx'
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
