import React, { Component } from 'react';
import request from '../services/request.js';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';

import Tag from '../components/Tag';

export default class PostForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      author: ''  //TODO: pegar do store
    }
  }

  render() {
    return (
      <Form>
        <Form.Group>
          <Tag text="NiceDay" variant="primary" />
        </Form.Group>
        <Form.Group>
          <Form.Control as="textarea" rows="5" 
          placeholder="Whats's your take right now, User?" />
        </Form.Group>
        <Form.Group>
          <Row className="justify-content-end">
            <Col lg={9}>
              <Form.Control type="text" placeholder="Tags" />
            </Col>
            <Col lg={3}>
              <Button variant="primary" block>Publish</Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
    )
  }
}