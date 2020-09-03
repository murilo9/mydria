import React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../pages/base';

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

class Topbar extends React.Component {
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
        <FontAwesomeIcon icon={faArrowLeft} className="my-profile-data-icon"/>
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
            <Navbar.Brand href="/feed">Mydria</Navbar.Brand>
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
                <FontAwesomeIcon icon={faSearch} className="my-profile-data-icon"/>
              </Button>
            </Form.Group>
          </Form>
          <Nav className={ 
            this.state.showMobileSearch ? "d-none" : "flex-row ml-auto my-navbar" 
          }>
            <Nav.Link href="" onClick={this.toggleMobileSearch}>
              <FontAwesomeIcon icon={faSearch} className="my-profile-data-icon"/>
            </Nav.Link>
            <NavDropdown title={this.props.user.nickname} alignRight
            className="d-none d-sm-block" id="basic-nav-dropdown">
              <NavDropdown.Item href={"/profile/" + this.props.user.nickname}>Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="settings" className="d-block d-sm-none">
              <span>Settings</span>
            </Nav.Link>
            <Nav.Link onClick={this.logout} className="d-block d-sm-none">
              <span>Logout</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);