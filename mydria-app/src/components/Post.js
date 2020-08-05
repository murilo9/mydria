import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  ...state
})

class Post extends Component {

  constructor(props){
    super(props);
    this.state = {
      tempLike: false,
      tempUnlike: false
    }
    this.renderPostDate = this.renderPostDate.bind(this);
    this.liked = this.liked.bind(this);
    this.unliked = this.unliked.bind(this);
    this.likeClick = this.likeClick.bind(this);
    this.unlikeClick = this.unlikeClick.bind(this);
    this.renderLikesQty = this.renderLikesQty.bind(this);
    this.renderUnlikesQty = this.renderUnlikesQty.bind(this);
    this.clickCallback = this.clickCallback.bind(this);
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

  render() {
    return (
      <Container fluid className="mb-3 my-post">
        <Media>
          <img
            width={64}
            height={64}
            className="mr-3"
            src="assets/user.svg"
            alt="User picture"
          />
          <Media.Body>
            <Row className="justify-content-end">
              <Col>
                <strong>{ this.props.postData.author.nickname }</strong>
              </Col>
              <Col xs="auto">
                { this.renderPostDate() }
              </Col>
            </Row>
            <p>
              { this.props.postData.text }
            </p>
          </Media.Body>
        </Media>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button variant={this.liked() ? "dark" : "outline-dark"} onClick={ this.likeClick }>
              <FontAwesomeIcon icon={faThumbsUp} />
              { this.renderLikesQty() }
            </Button>{' '}
            <Button variant={this.unliked() ? "dark" : "outline-dark"} onClick={ this.unlikeClick }>
              <FontAwesomeIcon icon={faThumbsDown} />
              { this.renderUnlikesQty() }
            </Button>{' '}
            <Button variant="outline-dark">
              <FontAwesomeIcon icon={faComment} />
                { ' ' + '0' /* TODO comments */ }
            </Button>{' '}
            <Button variant="outline-dark">
              Share
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Post);