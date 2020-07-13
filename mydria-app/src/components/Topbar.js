import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class Topbar extends React.Component {
  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout();
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="feed">Mydria</Navbar.Brand>
        <Form inline>
          <Form.Group controlId="formBasicSearch">
            <Form.Control type="text" 
            name="search"
            placeholder="Search" 
          />
          </Form.Group>
          <Button variant="dark" >
            Search
          </Button>
        </Form>
        <Nav className="ml-auto">
          <Nav.Link href="profile">Profile</Nav.Link>
          <Nav.Link href="settings">Settings</Nav.Link>
          <Nav.Link onClick={this.logout}>Logout</Nav.Link>
        </Nav>
      </Navbar>
    )
  }
}