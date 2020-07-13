import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import requestService from '../services/request';
import Cookies from 'js-cookie';

import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      //Usado durante o render para redirecionar pra página de feed ou não:
      sessionActive: false,
      //
      warning: ''
    }
    this.doLogin = this.doLogin.bind(this);
    this.warningMessage = this.warningMessage.bind(this);
  }

  async componentDidMount() {
    let token = Cookies.get('token');
    const session = await requestService.validateSession(token);
    if(session.active){
      this.setState({ sessionActive: true });
    }
  }

  async doLogin(loginForm) {
    const login = await requestService.login(loginForm.email, loginForm.password);
    if(login.success){
      Cookies.set('token', login.token);
      Cookies.set('userId', login.userId);
      this.setState({ sessionActive: true })
    }
    else{
      this.setState({ warningMessage: login.message });
    }
  }

  warningMessage() {
    if(this.state.warningMessage){
      return (
        <Alert variant="danger">
          {this.state.warningMessage}
        </Alert>
      )
    }
    else{
      return null;
    }
  }

  render(){
    if(this.state.sessionActive){
      return <Redirect to="/feed" />
    }
    else{
      return (
        <Container>
          {this.warningMessage()}
           <Row className="justify-content-sm-center">
            <Col sm="6">
              <Logo />
              <LoginForm doLogin={this.doLogin} />
            </Col>
          </Row>
        </Container>
      )
    }
  }
}