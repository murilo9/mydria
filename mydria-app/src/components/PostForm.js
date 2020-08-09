import React, { Component } from 'react';
import request from '../services/request.js';
import { connect } from 'react-redux';

import { setPageData } from '../actions';
import sanitize from '../helpers/stringSanitizer.js';

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
      posting: false,   //Exibe um spinner de posting enquanto estiver postando
      error: false,   //Exibe uma mensagem de erro, caso tenha
      warning: false, //Exibe uma mensagem de warning, caso tenha
      message: false,  //Exibe uma mensagem de sucesso, caso tenha,
      tags: []
    }
    this.publishPost = this.publishPost.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.renderWarningMessage = this.renderWarningMessage.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onTagPush = this.onTagPush.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  /**
   * Faz uma requisição ao servidor para publicar o post.
   */
  async publishPost(){
    //Ativa o spinner:
    this.setState({
      posting: true
    })
    //Constrói o objeto do post:
    let post = this.buildPost();
    //Faz a requisição pro servidor:
    let req = await request.publishPost(post);
    if(req.success){
      this.appendCreatedPost(req.post);   //Insere o post recém-criado no feed
      this.setState({
        message: 'Your post was successfully published.'
      });
      document.getElementById('postText').value = '';   //Limpa o postForm
    }
    //Caso tenha ocorrido algum erro:
    else{
      //Exibe o erro como mensagem de warning:
      this.setState({
        warning: req.error.data
      })
    }
  }

  /**
   * Acessa os inputs do form e retorna um objeto de post construído
   * pronto para ser enviado ao servidor.
   */
  buildPost(){
    const text = document.getElementById('postText').value;
    const author = this.props.session.userId;
    const tags = this.state.tags;
    return {
      text,
      author,
      tags
    }
  }

  /**
   * Insere um post recém-criado no topo do feed do usuário.
   * @param {*} post Post recém-criado que chegou do servidor
   */
  appendCreatedPost(post){
    let feedPosts = this.props.page.feedPosts;
    feedPosts.unshift(post);
    this.props.setPageData({
      feedPosts
    })
  }

  /**
   * Renderiza a mensagem de erro, caso haja.
   */
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

  /**
   * Renderiza a mensagem de warning, caso haja.
   */
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

  /**
   * Renderiza a mensagem de sucesso, caso haja.
   */
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

  onTagPush(target){
    if(target.charCode === 13){
      let tagInput = document.getElementById('my-postform-tags-input');
      let tagContent = tagInput.value;
      tagContent = sanitize(tagContent);
      let tagExists = this.state.tags.indexOf(tagContent) >= 0;
      if(tagContent && !tagExists){
        let tags = this.state.tags;
        tags.push(tagContent);
        this.setState({ tags });
        tagInput.value = '';
      }
    }
  }

  removeTag(tagContent){
    let tagIndex = this.state.tags.indexOf(tagContent);
    this.state.tags.splice(tagIndex, 1);
  }

  renderTags(){
    let tags = [];
    this.state.tags.forEach(tag => {
      tags.push(<Tag text={tag} key={tag} variant="info" removeTag={this.removeTag}/>)
    })
    return tags.length ? 
      <Form.Group className="my-postform-tags-container">
        { tags }
      </Form.Group>
      : null;
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
        <Form key="postForm" onSubmit={(e) => e.preventDefault()}>
          { this.renderTags() }
          <Form.Group controlId="postText">
            <Form.Control as="textarea" rows="5"
            placeholder={`Whats's your take right now, ${this.props.user.nickname}?`} />
          </Form.Group>
          <Form.Group>
            <Row className="justify-content-end">
              <Col md={9} className="my-tags-input">
                <Form.Control type="text" placeholder="Tags" 
                onKeyPress={this.onTagPush} id="my-postform-tags-input"/>
              </Col>
              <Col md={3} className="my-publish-button-col">
                <Button variant="info" block onClick={this.publishPost}>Publish</Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      ]
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);