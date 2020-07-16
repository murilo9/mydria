import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default class Topbar extends React.Component {
  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      showMobileSearch: false
    }
    this.toggleMobileSearch = this.toggleMobileSearch.bind(this);
    this.renderMobileSearchReturnButton = this.renderMobileSearchReturnButton.bind(this)
  }

  logout() {
    this.props.logout();
  }

  toggleMobileSearch() {
    this.setState({ showMobileSearch: !this.state.showMobileSearch });
  }

  renderMobileSearchReturnButton() {
    return this.state.showMobileSearch ?
    <Form.Group controlId="formBasicReturn">
      <Button variant="dark" onClick={this.toggleMobileSearch}>
        <i className="fas fa-arrow-left"></i>
      </Button>
    </Form.Group>
    : null
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="md" fixed="top">
        <Container>
          {
            this.state.showMobileSearch ? null :
            <Navbar.Brand href="feed">Mydria</Navbar.Brand>
          }
          <Form inline className={ this.state.showMobileSearch ? 
          "my-mobile-search" : "d-none d-sm-flex" }>
            {this.renderMobileSearchReturnButton()}
            <Form.Group controlId="formBasicInput">
              <Form.Control type="text" 
                name="search"
                placeholder="Search" 
              />
            </Form.Group>
            <Form.Group controlId="formBasicSearch">
              <Button variant="dark" >
                <i className="fas fa-search"></i>
              </Button>
            </Form.Group>
          </Form>
          <Nav className={ 
            this.state.showMobileSearch ? "d-none" : "flex-row ml-auto my-navbar" 
          }>
            <Nav.Link href="" onClick={this.toggleMobileSearch}>
              <i className="fas fa-search d-block d-sm-none"></i>
            </Nav.Link>
            <Nav.Link href="profile">
              <i className="far fa-user d-block d-sm-none"></i>
              <span className="d-none d-sm-block">Profile</span>
            </Nav.Link>
            <Nav.Link href="settings">
              <i className="far fa-list-alt d-block d-sm-none"></i>
              <span className="d-none d-sm-block">Settings</span>
            </Nav.Link>
            <Nav.Link onClick={this.logout}>
              <i className="fas fa-sign-out-alt d-block d-sm-none"></i>
              <span className="d-none d-sm-block">Logout</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
  }
}