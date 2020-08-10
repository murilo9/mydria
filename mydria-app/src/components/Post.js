import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
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

const mapStateToProps = state => ({
  ...state
})

class Post extends Component {

  constructor(props){
    super(props);
    this.state = {
      tempLike: false,
      tempUnlike: false,
      error: false
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
      //TODO: tratar erros na request
      console.log(req);
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
      //TODO: tratar erros na request
      console.log(req);
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

  renderError(){
    return this.state.error ?
    <Alert variant="danger"> {this.state.error} </Alert>
    :
    null
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

  render() {
    return (
      <Container fluid className="mb-3 my-post">
        { this.renderError() }
        <Media>
          <img
            width={64}
            height={64}
            className="mr-3"
            src="assets/user.svg"
            alt="User picture"
          />
          <Media.Body>
            <Row className="justify-content-end mb-1">
              <Col className="d-flex align-items-start justify-content-center flex-column">
                <div className="my-post-author-name">
                  <strong>{ this.props.postData.author.nickname }</strong>
                </div>
                <div className="my-post-date">
                  { this.renderPostDate() }
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
            <Row>
              <Col>
            { this.renderPostTags() }
            <p className="my-post-text">
              { this.props.postData.text }
            </p>
            </Col>
            </Row>
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
            <Button variant="outline-dark">
              <FontAwesomeIcon icon={faComment} />
                { ' ' + '0' /* TODO comments */ }
            </Button>{' '}
            <Button variant="outline-dark">
              <FontAwesomeIcon icon={faShare} />
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Post);