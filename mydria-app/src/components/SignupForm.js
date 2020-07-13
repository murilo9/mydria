import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class SignupForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      nickname: '',
      password: '',
      passwordAgain: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  }

  /**
   * Emite o evento pro parent: realizar sign up
   */
  handleSignup(){
    this.props.doSignup(this.state);
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formSignupEmail">
          <Form.Control type="email" 
            name="email"
            placeholder="E-mail" 
            value={this.state.email} 
            onChange={this.handleChange.bind(this)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formSignupNickname">
          <Form.Control type="text" 
            name="nickname"
            placeholder="Nickname" 
            value={this.state.nickname} 
            onChange={this.handleChange.bind(this)}
          />
        </Form.Group>

        <Form.Group controlId="formSignupPassword">
          <Form.Control type="password" 
            name="password"
            placeholder="Password" 
            value={this.state.password}
            onChange={this.handleChange.bind(this)}
          />
        </Form.Group>

        <Form.Group controlId="formSignupPasswordAgain">
          <Form.Control type="password" 
            name="passwordAgain"
            placeholder="Password again" 
            value={this.state.passwordAgain}
            onChange={this.handleChange.bind(this)}
          />
          <Form.Text className="text-muted">
            Warning: this is NOT a secure application! Do not use your passwords 
            from another accounts (email, social networks, etc).
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I totally agree with the Privacy Policy" />
        </Form.Group>
        
        <Button variant="primary" onClick={this.handleSignup} block>
          Sign up
        </Button>
      </Form>
    )
  }
}