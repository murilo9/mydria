import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  ...state
})

class CommentForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      postId: props.postId
    }
  }

  getId(){
    return 'comment-form-' + this.state.postId;
  }

  render() {
    return <Form>
      <Form.Group>
        <Form.Control as="textarea" rows="3" 
        placeholder="Leave a comment" id={this.getId()} />
      </Form.Group>
      <Row className="justify-content-between">
        <Col md={5} lg={4}>
          <Button variant="secondary" block 
          onClick={this.props.hideComments} className="mb-3">Cancel</Button>
        </Col>
        <Col md={5} lg={4}>
          <Button variant="info" block 
          onClick={this.props.publishComment} className="mb-3">Comment</Button>
        </Col>
      </Row>
    </Form>
  }
}

export default connect(mapStateToProps)(CommentForm);