import React, { Component } from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export default class FeedPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      sessionExpired: false
    }
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    let token = Cookies.get('token');
    const session = await request.validateSession(token);
    if(session.active){
      console.log(session.userData)
    }
    else{
      this.logout();
    }
  }

  logout(){
    Cookies.remove('token');
    Cookies.remove('userId');
    //TODO: limpar store
    this.setState({ sessionExpired: true });
  }

  render(){
    if(this.state.sessionExpired){
      return <Redirect to="/login" />
    }
    else{
      return (
        <Container>
          <Row>
            <Col>
              <h2>Feed</h2>
              <Button variant="primary" onClick={this.logout}>Logout</Button>
            </Col>
          </Row>
        </Container>
      )
    }
  }
}