import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class LoginForm extends Component {
  constructor(props){
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    if(e.charCode === 13){
      this.handleLogin();
    }
  }

  handleLogin() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    this.props.doLogin({ email, password });
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="email-input">
          <Form.Control type="email" 
          name="email"
          placeholder="E-mail" 
          onKeyPress={this.handleKeyPress}
        />
        </Form.Group>

        <Form.Group controlId="password-input">
          <Form.Control type="password" 
          name="password"
          placeholder="Password" 
          onKeyPress={this.handleKeyPress}
        />
        </Form.Group>
        <Button variant="info" onClick={this.handleLogin} block>
          Login
        </Button>
      </Form>
    )
  }
}