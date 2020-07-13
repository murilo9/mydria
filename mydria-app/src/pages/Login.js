import React, { Component } from 'react';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false
    }
  }

  render(){
    return <h2>Login</h2>
  }
}