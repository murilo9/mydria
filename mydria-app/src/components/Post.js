import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComment, 
  faThumbsDown, 
  faThumbsUp, 
  faTrashAlt,
  faMinusSquare,
  faEdit,
  faEllipsisH,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Tag from './Tag.js';
import PostComment from './Comment.js';
import sanitize from '../helpers/stringSanitizer.js';
import CommentForm from './CommentForm.js';

const mapStateToProps = state => ({
  ...state
})

class Post extends Component {

  constructor(props){
    super(props);
    this.state = {
      userPictureUrl: request.resolveImageUrl(props.postData.author.profilePicture),
      tempLike: false,
      tempUnlike: false,
      showComments: false,
      error: false,
      editing: false,
      editText: '',
      editTags: [],
      postComments: []
    }
    this.renderPostDate = this.renderPostDate.bind(this);
    this.liked = this.liked.bind(this);
    this.unliked = this.unliked.bind(this);
    this.likeClick = this.likeClick.bind(this);
    this.unlikeClick = this.unlikeClick.bind(this);
    this.renderLikesQty = this.renderLikesQty.bind(this);
    this.renderUnlikesQty = this.renderUnlikesQty.bind(this);
    this.clickCallback = this.clickCallback.bind(this);
    this.renderPostTags = this.renderPostTags.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderError = this.renderError.bind(this);
    this.userIsAuthor = this.userIsAuthor.bind(this);
    this.hidePost = this.hidePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.editPost = this.editPost.bind(this);
    this.uneditPost = this.uneditPost.bind(this);
    this.renderEditForm = this.renderEditForm.bind(this);
    this.removeEditTag = this.removeEditTag.bind(this);
    this.renderEditTags = this.renderEditTags.bind(this);
    this.onTagPush = this.onTagPush.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.getProfilePageUrl = this.getProfilePageUrl.bind(this);
    this.renderPostPhoto = this.renderPostPhoto.bind(this);
    this.showComments = this.showComments.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.publishComment = this.publishComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  userIsAuthor(){
    const userId = this.props.session.userId;
    const authorId = this.props.postData.author._id;
    return userId === authorId;
  }

  /**
   * Retorna a string da data de criação do post.
   */
  renderPostDate(){
    let date = new Date(this.props.postData.date);
    return date.toDateString();
  }

  /**
   * Retorna se o usuário deu like neste post.
   */
  liked(){
    return this.props.postData.likedBy
    .filter(userLiked => userLiked === this.props.session.userId).length;
  }

  /**
   * Retorna se o usuário deu unlike neste post.
   */
  unliked(){
    return this.props.postData.unlikedBy
    .filter(userUnliked => userUnliked === this.props.session.userId).length;
  }

  /**
   * Chama o request service para processar o clique no botão de like.
   */
  async likeClick(){
    //Adiciona um like temporariamente
    this.setState({
      tempLike: true,
      tempUnlike: false
    })
    //Faz a requisição pro request service:
    let req = await request.likePost(this.props.postData._id);
    if(req.success){
      this.props.updatePost(req.post, this.clickCallback);
    }
    else{
      this.setState({
        error: req.error
      })
    }
  }

  /**
   * Chama o request service para processar o clique no botão de unlike.
   */
  async unlikeClick(){
    //Adiciona um unlike temporariamente
    this.setState({
      tempLike: false,
      tempUnlike: true
    })
    //Faz a requisição pro request service:
    let req = await request.unlikePost(this.props.postData._id);
    if(req.success){
      this.props.updatePost(req.post, this.clickCallback);
    }
    else{
      this.setState({
        error: req.error
      })
    }
  }

  /**
   * Callback da função que atualiza o post na página de feed. Remove os like/unlike
   * temporários e renderiza o component para aplicar as modificações.
   */
  clickCallback(){
    //Remove o unlike temporário
    this.setState({
      tempLike: false,
      tempUnlike: false
    })
  }

  hidePost(){
    //TODO
  }

  async deletePost(){
    const postId = this.props.postData._id;
    let res = await request.deletePost(postId);
    if(res.success){
      //Chama a função do pai pra deletar o post do store:
      this.props.deletePost(postId);
    }
    else{
      this.setState({
        error: 'Something went wrong at our server. Please try again later.'
      })
    }
  }

  editPost(){
    let postTags = [...this.props.postData.tags];
    let postText = this.props.postData.text;
    this.setState({
      editing: true,
      editTags: postTags
    })
    setTimeout(() => {
      let postTextarea = document.getElementById('edit-post-form-' + this.props.postData._id)
      postTextarea.value = postText;
    }, 10)
  }

  uneditPost(){
    this.setState({
      editing: false
    })
  }

  /**
   * Retorna a quantidade de likes do post.
   */
  renderLikesQty(){
    let tempLike = this.state.tempLike ? 1 : 0;
    return ' ' + (this.props.postData.likedBy.length + tempLike);
  }

  /**
   * Retorna a quantidade de unlikes do post.
   */
  renderUnlikesQty(){
    let tempUnlike = this.state.tempUnlike ? 1 : 0;
    return ' ' + (this.props.postData.unlikedBy.length + tempUnlike);
  }

  renderPostTags(){
    if(this.props.postData.tags.length){
      let tags = [];
      this.props.postData.tags.forEach(tagContent => {
      tags.push(<a href="#" key={tagContent}>#{ tagContent } </a>)
      })
      return tags;
    }
    else{
      return null;
    }
  }

  removeEditTag(tagContent){
    let tagIndex = this.state.editTags.indexOf(tagContent);
    let editTags = [...this.state.editTags];
    editTags.splice(tagIndex, 1);
    this.setState({
      editTags
    })
  }

  renderEditTags(){
    let tags = [];
    this.state.editTags.forEach(tag => {
      tags.push(<Tag text={tag} key={tag} variant="info" removeTag={ this.removeEditTag }/>)
    })
    return tags.length ? 
      <Row>
        <Col>
          { tags }
        </Col>
      </Row>
      : null;
  }

  onTagPush(target){
    if(target.charCode === 13){
      let tagInput = document
      .getElementById("edit-postform-tags-input" + this.props.postData._id);
      let tagContent = tagInput.value;
      tagContent = sanitize(tagContent);
      let tagExists = this.state.editTags.indexOf(tagContent) >= 0;
      if(tagContent && !tagExists){
        let tags = this.state.editTags;
        tags.push(tagContent);
        this.setState({ 
          editTags: tags 
        });
        tagInput.value = '';
      }
    }
  }

  async saveChanges(){
    let updatedPost = {...this.props.postData};
    const updatedText = document.getElementById('edit-post-form-' + this.props.postData._id).value;
    const updatedTags = this.state.editTags;
    updatedPost.text = updatedText;
    updatedPost.tags = updatedTags;
    let res = await request.updatePost(updatedPost);
    if(res.success){
      this.props.updatePost(res.post, () => {
        this.setState({
          editing: false
        })
      });
    }
    else{
      this.setState({
        error: res.error
      })
    }
  }

  async publishComment(){
    const postId = this.props.postData._id;
    const commentFormId = 'comment-form-' + postId;
    const commentText = document.getElementById(commentFormId).value;
    let comment = {
      author: this.props.session.userId,
      text: commentText
    }
    let req = await request.publishComment(comment, postId);
    if(req.success){
      let comment = req.data;
      let postComments = this.state.postComments;
      postComments.push(comment);
      this.setState({
        postComments
      })
      document.getElementById(commentFormId).value = "";
    }
    else{
      //TODO - Tratamento de erro ao publicar comentário
    }
  }

  deleteComment(commentId){
    let postComments = this.state.postComments;
    for(let c = 0; c < postComments.length; c++){
      if(postComments[c]._id === commentId){
        postComments.splice(c, 1);
        break;
      }
    }
    this.setState({ postComments });
  }

  renderError(){
    return this.state.error ?
    <Alert variant="danger"> {this.state.error} </Alert>
    :
    null
  }

  renderEditForm(){
    return <React.Fragment>
      { this.renderEditTags() }
      <Form.Control type="text" placeholder="Tags" 
      className="mb-2" onKeyPress={ this.onTagPush } 
      id={ "edit-postform-tags-input" + this.props.postData._id }/>
      <Form.Control as="textarea" rows="5" className="mb-2"
      id={ 'edit-post-form-' + this.props.postData._id } />
      <Row className="justify-content-end">
        <Col xs="auto">
          <Button variant="secondary" onClick={ this.uneditPost }>Cancel</Button>
          {' '}
          <Button variant="info" onClick={ this.saveChanges }>Save</Button>
        </Col>
      </Row>
    </React.Fragment>
  }

  renderActions(){
    return this.userIsAuthor() ?
    <React.Fragment>
      <Dropdown.Item href="#" onClick={ this.editPost }>
        <FontAwesomeIcon icon={faEdit} /> Edit
      </Dropdown.Item>
      <Dropdown.Item href="#" onClick={ this.deletePost }>
        <FontAwesomeIcon icon={faTrashAlt} /> Delete
      </Dropdown.Item>
    </React.Fragment>
    :
    <Dropdown.Item href="#" onclick="event.preventDefault()" onClick={ this.hidePost }>
      <FontAwesomeIcon icon={faMinusSquare} /> Hide this
    </Dropdown.Item>
  }

  renderPostPhoto(){
    return this.props.postData.img ?
    <Image src={request.resolveImageUrl(this.props.postData.img)} fluid/>
    : null;
  }

  renderComments(){
    if(this.state.showComments){
      let comments = [];
      this.state.postComments.forEach(comment => {
        comments.push(<PostComment commentData={ comment } deleteComment={this.deleteComment}/>);
      })
      return <React.Fragment>
        <Container fluid>
          { comments.length ? comments : <Alert variant="secondary">No comments yet</Alert> }
          <CommentForm postId={this.props.postData._id} publishComment={this.publishComment} />
        </Container>
      </React.Fragment>
    }
    else{
      return null;
    }
  }

  async showComments(){
    let req = await request.getPostComments(this.props.postData._id);
    if(req.success){
      this.setState({
        postComments: req.data,
        showComments: true
      });
    }
    else{
      console.log(req.error)
      //TODO - Exibir erro de carregamento dos comentários
    }
  }

  getProfilePageUrl(){
    return '/profile/' + this.props.postData.author.nickname;
  }

  render() {
    return (
      <Container fluid className="mb-3 my-post" key={this.props.postData._id}>
        { this.renderError() }
        { this.state.editing ?
        this.renderEditForm()
        :
        <React.Fragment>
          <Media>
            <div className="my-profile-picture-wrapper post mr-3 d-none d-sm-block">
              <a className="my-profile-picture" href={"/profile/" + this.props.postData.author.nickname}
              style={{backgroundImage: `url(${this.state.userPictureUrl})`}}></a>
            </div>
            <Media.Body>
              <Row className="justify-content-end mb-2">
                <Col className="d-flex align-items-start flex-row">
                  <div className="my-profile-picture-wrapper post mr-3 d-block d-sm-none">
                    <a className="my-profile-picture" href={"/profile/" + this.props.postData.author.nickname}
                    style={{backgroundImage: `url(${this.state.userPictureUrl})`}}></a>
                  </div>
                  <div>
                    <a href={ this.getProfilePageUrl() } className="my-post-author-name">
                      <strong>{ this.props.postData.author.nickname }</strong>
                    </a>
                    <div className="my-post-date">
                      { this.renderPostDate() }
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <Dropdown className="my-post-options" alignRight>
                    {' '}
                    <Dropdown.Toggle variant="outline-dark" 
                    className="my-post-options-button"
                    id={"my-post-options-button-" + this.props.postData._id}>
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      { this.renderActions() }
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
              <Row className="my-post-content">
                <Col>
                  { this.renderPostTags() }
                  <p className="my-post-text">
                    { this.props.postData.text }
                  </p>
                  { this.renderPostPhoto() }
                </Col>
              </Row>
              { this.renderComments() }
            </Media.Body>
          </Media>
          <Row className="justify-content-end my-post-buttons">
            <Col xs="auto">
              <Button onClick={ this.likeClick }
              variant={this.liked() ? "dark" : "outline-dark"} >
                <FontAwesomeIcon icon={faThumbsUp} />
                { this.renderLikesQty() }
              </Button>{' '}
              <Button onClick={ this.unlikeClick }
              variant={this.unliked() ? "dark" : "outline-dark"} >
                <FontAwesomeIcon icon={faThumbsDown} />
                { this.renderUnlikesQty() }
              </Button>{' '}
              <Button variant="outline-dark" onClick={ this.showComments }>
                <FontAwesomeIcon icon={faComment} />
                  { ' ' + this.props.postData.commentsTotal }
              </Button>{' '}
              <Button variant="outline-dark">
                <FontAwesomeIcon icon={faShare} />
              </Button>
            </Col>
          </Row>
        </React.Fragment>
        }
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Post);