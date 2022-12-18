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
        <Button variant="link" className="mx-0 my-0 px-2 py-0">
          <Search color="black" className="my-1" size={14} />
        </Button>
      </React.Fragment>
    )
  }
}

export default SearchComp
