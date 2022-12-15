import React from 'react'
import {
  InputGroup,
  Form,
  Button,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap'
import { X, Search } from 'react-bootstrap-icons'

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
        {!this.state.shouldClose ? (
          <Button id="searchOpen" variant="dark" onClick={this.toggleClose}>
            <Search color="white" />
          </Button>
        ) : (
          <InputGroup id="searchInput">
            <DropdownButton
              variant="info"
              title={this.state.user ? '@' : '#'}
              id="searchType"
              onClick={() => {
                if (to !== null) {
                  to = setTimeout(this.toggleClose, 10000)
                }
              }}
            >
              <Dropdown.Item onClick={this.toggleUser}>
                {this.state.user ? '#' : '@'}
              </Dropdown.Item>
            </DropdownButton>
            <Form.Control
              id="searchTextBox"
              placeholder={this.state.user ? '@name' : '#topic'}
              aria-label={this.state.user ? 'Username' : 'Hashtag'}
              aria-describedby={this.state.user ? 'AtSign' : 'HashSign'}
              autoFocus
              onBlur={() => {
                to = setTimeout(this.toggleClose, 10000)
              }}
            />
          </InputGroup>
        )}
      </React.Fragment>
    )
  }
}

export default SearchComp
