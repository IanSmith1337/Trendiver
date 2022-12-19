import React from 'react'

export default class WindowComp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        id={this.props.name}
        className="position-relative p-2 overflow-hidden border-1"
      >
        {this.props.children}
      </div>
    )
  }
}
