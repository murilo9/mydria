import React, { Component } from 'react';
import request from '../services/request.js';

import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export default class Post extends Component {
  
  render() {
    return (
      <Col sm={3} className="my-ads d-none d-sm-flex">Following Feed</Col>
    )
  }
}