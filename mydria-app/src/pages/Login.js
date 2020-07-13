import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import requestService from '../services/request';
import Cookies from 'js-cookie';

import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      //Usado durante o render para redirecionar pra página de feed ou não:
      sessionActive: false
    }
    this.doLogin = this.doLogin.bind(this);
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
      //TODO: exibir alerta
    }
  }

  render(){
    if(this.state.sessionActive){
      return <Redirect to="/feed" />
    }
    else{
      return (
        <Container>
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