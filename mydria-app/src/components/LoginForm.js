import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class LoginForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  }

  handleLogin() {
    this.props.doLogin(this.state);
  }

  handleSignup(){
    console.log('signup')
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Control type="email" 
          name="email"
          placeholder="E-mail" 
          value={this.state.email} 
          onChange={this.handleChange.bind(this)}
        />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Control type="password" 
          name="password"
          placeholder="Password" 
          value={this.state.password}
          onChange={this.handleChange.bind(this)}
        />
        </Form.Group>
        <Button variant="primary" onClick={this.handleLogin}>
          Login
        </Button>{' '}
        <Button variant="dark" onClick={this.handleSignup}>
          Sign up
        </Button>
      </Form>
    )
  }
}