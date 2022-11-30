import React from 'react'
import {
  InputGroup,
  Form,
  Button,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap'
import { X, Search } from 'react-bootstrap-icons'

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
          <Button onClick={this.toggleClose}>
            <Search width={24} height={24} color="white" />
          </Button>
        ) : (
          <InputGroup className="md-3">
            <DropdownButton title={this.state.user ? '@' : '#'} id="SearchType">
              <Dropdown.Item onClick={this.toggleUser}>
                {this.state.user ? '#' : '@'}
              </Dropdown.Item>
            </DropdownButton>
            <Form.Control
              placeholder={this.state.user ? '@name' : '#topic'}
              aria-label={this.state.user ? 'Username' : 'Hashtag'}
              aria-describedby={this.state.user ? 'AtSign' : 'HashSign'}
            />
            <Button id="SearchSubmit">Search</Button>
            <Button onClick={this.toggleClose}>
              <X width={24} height={24} color="white" />
            </Button>
          </InputGroup>
        )}
      </React.Fragment>
    )
  }
}

export default SearchComp