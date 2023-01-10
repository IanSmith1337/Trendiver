import React from 'react'
import {
  InputGroup,
  Form,
  Button,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

var to = null

class SearchComp extends React.Component {
  constructor(props) {
    super(props)
    this.toggleClose = this.toggleClose.bind(this)
    this.toggleUser = this.toggleUser.bind(this)
    this.state = {
      user: false,
      shouldClose: false,
    }
  }

  toggleClose() {
    this.setState({ shouldClose: !this.state.shouldClose }, () => {
      console.log(this.state.shouldClose)
    })
  }

  toggleUser() {
    this.setState({ user: !this.state.user })
  }

  render() {
    return (
      <React.Fragment>
        <a id="aSearch" className="py-1">
          <Search size={14} id="searchIcon" color="white" />
        </a>
      </React.Fragment>
    )
  }
}

export default SearchComp
