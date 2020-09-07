import React, { Component } from 'react';
import Logo from '../components/Logo';
import Container from 'react-bootstrap/Container';

export default class NotFound extends Component {
  render(){
    return <div className="my-login-background my-not-found-page">
      <Logo />
      <p>
        404 - Ops... nothing found here. 🤷‍♂️
      </p>
    </div>
  }
}