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
      <Row className="mb-3">
        <Col sm="3">
          <Button variant="info" block onClick={this.props.publishComment}>Comment</Button>
        </Col>
      </Row>
    </Form>
  }
}

export default connect(mapStateToProps)(CommentForm);