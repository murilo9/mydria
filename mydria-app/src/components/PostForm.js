import React, { Component } from 'react';
import request from '../services/request.js';
import { connect } from 'react-redux';

import sanitize from '../helpers/stringSanitizer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faWindowClose, faTimes } from '@fortawesome/free-solid-svg-icons';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import Tag from '../components/Tag';

const mapStateToProps = state => ({
  ...state
})

class PostForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      posting: false,   //Exibe um spinner de posting enquanto estiver postando
      error: false,   //Exibe uma mensagem de erro, caso tenha
      warning: false, //Exibe uma mensagem de warning, caso tenha
      message: false,  //Exibe uma mensagem de sucesso, caso tenha
      showPhotoForm: false,
      hasPhoto: false,
      photoSrc: null,
      tags: []
    }
    this.publishPost = this.publishPost.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.renderWarningMessage = this.renderWarningMessage.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onTagPush = this.onTagPush.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handlePhotoPut = this.handlePhotoPut.bind(this);
    this.removePhoto = this.removePhoto.bind(this);
    this.togglePhotoForm = this.togglePhotoForm.bind(this);
    this.renderPhotoButton = this.renderPhotoButton.bind(this);
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
    let req = await request.publishPost(post, this.state.hasPhoto);
    if(req.success){
      this.props.appendPost(req.post);   //Insere o post recém-criado no feed
      this.setState({
        message: 'Your post was successfully published.'
      });
      if(this.state.showPhotoForm){
        this.togglePhotoForm();
      }
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

  togglePhotoForm(){
    if(this.state.hasPhoto){
      this.setState({
        hasPhoto: false
      })
    }
    this.setState({
      showPhotoForm: !this.state.showPhotoForm
    })
  }

  async handlePhotoPut(){
    let req = await request.setTmpImage();
    if(req.success){
      let imgData = req.data;
      let imgSrc = request.getTmpImageUrl(imgData.name, imgData.ext);
      this.setState({
        hasPhoto: true,
        photoSrc: imgSrc
      })
    }
    else{
      this.setState({
        error: req.error
      })
    }
  }

  removePhoto(){
    this.setState({
      hasPhoto: false
    })
    let photoInput = document.getElementById('post-file');
    photoInput.value = null;
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

  renderPostPhoto(){
    return this.state.hasPhoto ?
    <React.Fragment>
      <div className="my-post-form-photo">
        <Image src={this.state.photoSrc} fluid/>
        <div className="my-post-form-photo-wall">
          <Button variant="light" onClick={this.removePhoto} className="mr-2 mt-2">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </div>
    </React.Fragment>
    : null
  }

  renderPhotoForm(){
    return this.state.showPhotoForm ?
      <Form.Group>
        <Form.File
          className="position-relative"
          name="file"
          onChange={this.handlePhotoPut}
          id="post-file"
          feedbackTooltip
        />
      </Form.Group>
      : null
  }

  renderPhotoButton(){
    return this.state.showPhotoForm ?
      <Button variant="secondary" onClick={this.togglePhotoForm} block>
        Cancel
      </Button>
      :
      <Button variant="success" onClick={this.togglePhotoForm} block>
        <FontAwesomeIcon icon={faImage} />{' '}
        Photo
      </Button>
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
          { this.renderPostPhoto() }
          { this.renderPhotoForm() }
          <Form.Group>
            <Row className="justify-content-end">
              <Col md={8} lg={9} className="my-tags-input pr-sm-0">
                <Form.Control type="text" placeholder="Tags" 
                onKeyPress={this.onTagPush} id="my-postform-tags-input"/>
              </Col>
              <Col md={4} lg={3}>
                  { this.renderPhotoButton() }
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Button variant="info" block onClick={this.publishPost}>
              Publish
            </Button>
          </Form.Group>
        </Form>
      ]
    }
  }
}

export default connect(mapStateToProps)(PostForm);