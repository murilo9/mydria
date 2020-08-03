import React, { Component } from 'react';
import request from '../services/request.js';
import { connect } from 'react-redux';

import { setPageData } from '../actions';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Tag from '../components/Tag';

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  setPageData: data => dispatch(setPageData(data))
})

class PostForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      posting: false,
      error: false,
      warning: false,
      message: false
    }
    this.publishPost = this.publishPost.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.renderWarningMessage = this.renderWarningMessage.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  async publishPost(){
    this.setState({
      posting: true
    })
    let post = this.buildPost();
    let req = await request.publishPost(post);
    if(req.success){
      this.appendCreatedPost(req.post);   //Insere o post recém-criado no feed
      this.setState({
        message: 'Your post was successfully published.'
      });
      document.getElementById('postText').value = '';   //Limpa o postForm
    }
    else{
      this.setState({
        warning: req.error.data
      })
    }
  }

  buildPost(){
    const text = document.getElementById('postText').value;
    const author = this.props.session.userId;
    return {
      text,
      author
    }
  }

  appendCreatedPost(post){
    let feedPosts = this.props.page.feedPosts;
    feedPosts.unshift(post);
    this.props.setPageData({
      feedPosts
    })
    console.log(this.props)
  }

  renderErrorMessage(){
    return (
      this.state.error ?
      <Alert variant="danger" key="errorMessage">
        {this.state.error}
      </Alert>
      :
      null
    )
  }

  renderWarningMessage(){
    return (
      this.state.warning ?
      <Alert variant="warning" key="warningMessage">
        {this.state.warning}
      </Alert>
      :
      null
    )
  }

  renderMessage(){
    return (
      this.state.message ?
      <Alert variant="primary" key="message">
        {this.state.message}
      </Alert>
      :
      null
    )
  }


  render() {
    if(this.posting){
      return (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status">
              <span className="sr-only">Posting...</span>
            </Spinner>
          </Col>
        </Row>
      )
    }
    else{
      const message = this.renderMessage();
      const error = this.renderErrorMessage();
      const warning = this.renderWarningMessage();
      return [
        message,
        error,
        warning,
        <Form key="postForm">
          <Form.Group>
            <Tag text="NiceDay" variant="primary" />
          </Form.Group>
          <Form.Group controlId="postText">
            <Form.Control as="textarea" rows="5" 
            placeholder={`Whats's your take right now, ${this.props.user.nickname}?`} />
          </Form.Group>
          <Form.Group>
            <Row className="justify-content-end">
              <Col lg={9}>
                <Form.Control type="text" placeholder="Tags" />
              </Col>
              <Col lg={3}>
                <Button variant="primary" block onClick={this.publishPost}>Publish</Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      ]
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);