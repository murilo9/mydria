import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import requestService from '../services/request';
import Cookies from 'js-cookie';

import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      //Usado durante o render para redirecionar pra página de feed ou não:
      sessionActive: false,
      //
      warningMessage: '',
      successMessage: '',
      showSignupForm: false
    }
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.message = this.message.bind(this);
    this.formFooter = this.formFooter.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
  }

  async componentDidMount() {
    let token = Cookies.get('token');
    const session = await requestService.validateSession(token);
    if(session.active){
      this.setState({ sessionActive: true });
    }
  }

  /**
   * Faz a request no servidor para realizar o login.
   * @param {email: String, password: String} loginForm Form com os dados de login
   */
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

  /**
   * Faz a request no servidor para criar uma nova conta.
   * @param {*} signupForm Form com os dados do usuário
   */
  async doSignup(signupForm) {
    const signup = await requestService.signup(signupForm);
    if(signup.success){
      this.showLogin();
      this.setState({ successMessage: "Account successfuly created. You may now login." });
    }
    else{
      this.setState({ warningMessage: signup.message });
    }
  }

  /**
   * Exibe a mensagem de alerta em caso de erro ou sucesso em uma request.
   */
  message() {
    if(this.state.warningMessage){
      return (
        <Alert variant="danger">
          {this.state.warningMessage}
        </Alert>
      )
    }
    else if(this.state.successMessage){
      return (
        <Alert variant="primary">
          {this.state.successMessage}
        </Alert>
      )
    }
    else{
      return null;
    }
  }

  /**
   * Exibe o form de Sign up
   */
  showSignup() {
    this.setState({ showSignupForm: true });
  }

  /**
   * Exibe o form de Login
   */
  showLogin() {
    this.setState({ showSignupForm: false });
  }

  /**
   * Renderiza o footer do form
   */
  formFooter() {
    const actionButton = this.state.showSignupForm ?
      <Button variant="link" block onClick={this.showLogin}>
        Login
      </Button>
      :
      <Button variant="link" block onClick={this.showSignup}>
        Sign up
      </Button>
      
    return (
      <Row className="justify-content-md-between">
        <Col sm="auto" className="justify-content-center">
          <Button variant="link" block>Privacy Policy</Button>
        </Col>
        <Col sm="auto" className="justify-content-center">
          { actionButton }
        </Col>
      </Row>
    )
  }

  render(){
    if(this.state.sessionActive){
      return <Redirect to="/feed" />
    }
    else{
      const form = this.state.showSignupForm ? 
      <SignupForm doSignup={this.doSignup} /> : <LoginForm doLogin={this.doLogin} />

      return (
        <Container className="my-view-container">
           <Row className="justify-content-sm-center align-items-center my-full-height">
            <Col md="6" lg="4" xl="3">
              <Logo />
              { form }
              {this.formFooter()}
              {this.message()}
            </Col>
          </Row>
        </Container>
      )
    }
  }
}