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
      //Mensagem de warning a ser exibida, se houver
      warningMessage: '',
      //Mensagem de success a ser exibida, se houver
      successMessage: '',
      //Renderiza o form de signup ao invés do form de login
      showSignupForm: false
    }
    //Faz o bind das funções do component:
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderFormFooter = this.renderFormFooter.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  /**
   * Quando a view for montada, verifica se ja não existe uma session válida e ativa.
   */
  async componentDidMount() {
    let token = Cookies.get('token');
    const session = await requestService.validateSession(token);
    if(session.active){
      //Seta a variável que vai renderizar um <Redirect> pra mudar de página:
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
      Cookies.set('token', login.token);    //Seta o token nos cookies
      Cookies.set('userId', login.userId);  //Seta o userId nos cookies
      //Seta a variável que vai renderizar um <Redirect> pra mudar de página:
      this.setState({ sessionActive: true })
    }
    //Em caso de erro, renderiza a mensagem do servidor:
    else{   
      this.setState({ warningMessage: login.message });
    }
  }

  /**
   * Faz a request no servidor para criar uma nova conta.
   * @param {
   *  email: String,
   *  nickname: String,
   *  password: String,
   *  passwordAgain: String
   * } signupForm Form com os dados do usuário
   */
  async doSignup(signupForm) {
    const signup = await requestService.signup(signupForm);
    if(signup.success){
      this.showLogin();   //Exibe o form de login novamente
      //Exibe uma mensagem de conta criada com sucesso:
      this.setState({ successMessage: "Account successfuly created. You may now login." });
    }
    //Em caso de erro, renderiza a mensagem do servidor:
    else{ 
      this.setState({ warningMessage: signup.message });
    }
  }

  /**
   * Renderiza a mensagem de alerta em caso de erro ou sucesso em uma request
   * de acordo com o que está setado no state.
   */
  renderMessage() {
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
   * [comando] Faz exibir o form de Sign up.
   */
  showSignup() {
    this.setState({ showSignupForm: true });
  }

  /**
   * [comando] Faz exibir o form de Login.
   */
  showLogin() {
    this.setState({ showSignupForm: false });
  }

  renderForm() {
    return this.state.showSignupForm ? 
      <SignupForm doSignup={this.doSignup} /> 
      : 
      <LoginForm doLogin={this.doLogin} />
  }

  /**
   * Renderiza o footer do form.
   */
  renderFormFooter() {
    {/* Botão que alterna entre 'Login' e 'Signup' */}
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
    return this.state.sessionActive ?
      <Redirect to="/feed" />
      :
      <React.Fragment>
        <div class="my-login-background"></div>
        <Container className="my-login-container">
            <Row className="align-items-center my-full-height">
            <Col md="6" lg="7" className="my-login-phrase">
              Get in touch with your interests, while sharing your thoughts with the world.
            </Col>
            <Col md="6" lg="4" xl="3" className="my-login-box">
              <Logo />
              { this.renderForm() }
              { this.renderFormFooter() }
              { this.renderMessage() }
            </Col>
          </Row>
        </Container>
      </React.Fragment>
  }
}