import React, { Component } from 'react';
import request from '../services/request.js';
import { getImgUrl } from '../services/firebase.js';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
import ProfilePicture from './ProfilePicture.js';

const mapStateToProps = state => ({
  ...state
})

class Post extends Component {

  constructor(props){
    super(props);
    this.state = {
      tempLike: false,
      tempUnlike: false,
      showComments: false,
      showShareModal: false,
      showConfirmModal: false,
      confirmModalData: {},
      error: false,
      editing: false,
      editTags: [],
      postComments: [],
      postPictureUrl: '',     //Carregado no componentDidMount()
      authorPictureUrl: '',   //Carregado no componentDidMount()
      minipostPictureUrl: '',   //Carregado no componentDidMount()
      minipostAuthorPictureUrl: ''    //Carregado no componentDidMount()
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
    this.toggleComments = this.toggleComments.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.publishComment = this.publishComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.sharePost = this.sharePost.bind(this);
    this.renderMiniPost = this.renderMiniPost.bind(this);
    this.toggleShareModal = this.toggleShareModal.bind(this);
    this.renderShareModal = this.renderShareModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.showConfirmModal = this.showConfirmModal.bind(this);
    this.renderConfirmModal = this.renderConfirmModal.bind(this);
    this.renderLikeds = this.renderLikeds.bind(this);
    this.renderUnlikeds = this.renderUnlikeds.bind(this);
  }

  async componentDidMount(){
    //Carrega a imagem do post, se houver:
    if(this.props.postData.img){
      const postPictureUrl = await getImgUrl(this.props.postData.author._id, 
        this.props.postData.img);
      this.setState({
        postPictureUrl
      })
    }
    //Se este post foi compartilhado:
    if(this.props.postData.sharedFrom){
    }
    //Carrega a foto do autor do post:
    const authorId = this.props.postData.author._id;
    let authorPictureUrl = this.props.postData.author.profilePicture;
    if(authorPictureUrl){
      authorPictureUrl = await getImgUrl(authorId, authorPictureUrl);
    }
    this.setState({ authorPictureUrl });
    //Se o post foi compartilhado:
    if(this.props.postData.sharedFrom){
      const minipostData = this.props.postData.sharedFrom;
      //Carrega a imagem do minipost, se houver:
      let minipostPictureUrl = minipostData.img;
      if(minipostPictureUrl){
        minipostPictureUrl = await getImgUrl(minipostData.author._id, minipostPictureUrl);
        this.setState({ minipostPictureUrl });
      }
      //Carrega a imagem do autor do minipost:
      let minipostAuthorPictureUrl = minipostData.author.profilePicture;
      if(minipostAuthorPictureUrl){
        minipostAuthorPictureUrl = await getImgUrl(minipostData.author._id, minipostAuthorPictureUrl);
        this.setState({ minipostAuthorPictureUrl });
      }
    }
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
    .filter(userLiked => userLiked._id === this.props.session.userId).length;
  }

  /**
   * Retorna se o usuário deu unlike neste post.
   */
  unliked(){
    return this.props.postData.unlikedBy
    .filter(userUnliked => userUnliked._id === this.props.session.userId).length;
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
      this.setState({ showConfirmModal: false })
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

  async sharePost(){
    //Verifica se é pra compartilhar este post ou o original:
    let postId = this.props.postData.sharedFrom ? 
      this.props.postData.sharedFrom._id : this.props.postData._id;
    let shareText = document.getElementById('edit-post-form-' + this.props.postData._id).value;
    let shareTags = this.state.editTags;
    let res = await request.sharePost(postId, shareText, shareTags);
    if(res.success){
      this.props.appendPost(res.data);
    }
    else{
      console.log(res.error);
      //TODO - Tratamento adequado de erro ao compartilhar o post
    }
    this.toggleShareModal();
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

  renderPostTags(postTags){
    if(postTags.length){
      let tags = [];
      postTags.forEach(tagContent => {
        tags.push(<a href={"/feed?search=" + tagContent} key={tagContent}>
          #{ tagContent } 
        </a>)
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

  async deleteComment(commentId){
    let res = await request.deleteComment(commentId);
    if(res.success){
      let postComments = this.state.postComments;
      for(let c = 0; c < postComments.length; c++){
        if(postComments[c]._id === commentId){
          postComments.splice(c, 1);
          break;
        }
      }
      this.setState({ postComments });
      }
    else{
      console.log(res.error);
      //TODO - Tratamento de erro ao deletar comentário
    }
    this.setState({ showConfirmModal: false })
  }

  updateComment(updatedComment, next){
    let postComments = this.state.postComments;
    for(let c = 0; c < postComments.length; c++){
      if(postComments[c]._id === updatedComment._id){
        postComments.splice(c, 1, updatedComment);
        break;
      }
    }
    this.setState({ postComments });
    next();
  }

  renderError(){
    return this.state.error ?
    <Alert variant="danger"> {this.state.error} </Alert>
    :
    null
  }

  getProfilePageUrl(){
    return '/profile/' + this.props.postData.author.nickname;
  }

  renderEditForm(){
    const buttonsRow = <React.Fragment>
      <Row className="justify-content-end">
        <Col xs="auto">
          <Button variant="secondary" onClick={ this.uneditPost }>Cancel</Button>
          {' '}
          <Button variant="info" onClick={ this.saveChanges }>Save</Button>
        </Col>
      </Row>
    </React.Fragment>

    return <React.Fragment>
      <h4>Edit post</h4>
      { this.renderEditTags() }
      <Form.Control type="text" placeholder="Tags" 
      className="mb-2" onKeyPress={ this.onTagPush } 
      id={ "edit-postform-tags-input" + this.props.postData._id }/>
      <Form.Control as="textarea" rows="5" className="mb-2"
      id={ 'edit-post-form-' + this.props.postData._id }/>
      { 
        this.renderMiniPost(
          this.props.postData.nickname,
          this.state.authorPictureUrl,
          this.props.postData.text,
          this.props.postData.tags,
          this.state.postPictureUrl
        ) 
      }
      { buttonsRow }
    </React.Fragment>
  }

  renderShareForm(){
    return <React.Fragment>
      { this.renderEditTags() }
      <Form.Control type="text" placeholder="Tags" 
      className="mb-2" onKeyPress={ this.onTagPush } 
      id={ "edit-postform-tags-input" + this.props.postData._id }/>
      <Form.Control as="textarea" rows="3" className="mb-2"
      id={ 'edit-post-form-' + this.props.postData._id } 
      placeholder="Say something about it"/>
      { 
        this.props.postData.sharedFrom ?
        this.renderMiniPost(
          this.props.postData.sharedFrom.author.nickname,
          this.state.minipostAuthorPictureUrl,
          this.props.postData.sharedFrom.text,
          this.props.postData.sharedFrom.tags,
          this.state.minipostPictureUrl
        ) :
        this.renderMiniPost(
          this.props.postData.author.nickname,
          this.state.authorPictureUrl,
          this.props.postData.text,
          this.props.postData.tags,
          this.state.postPictureUrl
        )
      }
    </React.Fragment>
  }

  renderActions(){
    return this.userIsAuthor() ?
    <React.Fragment>
      <Dropdown.Item href="#" onClick={ this.editPost }>
        <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
      </Dropdown.Item>
      <Dropdown.Item href="#" onClick={ () => this.showConfirmModal(
        'Delete post',
        'Are you sure you want to delete this post?',
        'Delete',
        this.deletePost
      )}>
        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Delete
      </Dropdown.Item>
    </React.Fragment>
    :
    <Dropdown.Item href="#" onclick="event.preventDefault()" onClick={ this.hidePost }>
      <FontAwesomeIcon icon={faMinusSquare} className="mr-2" /> Hide this
    </Dropdown.Item>
  }

  renderPostPhoto(url){
    return url ?
    <Image src={url} fluid/>
    : null;
  }

  renderComments(){
    if(this.state.showComments){
      let comments = [];
      this.state.postComments.forEach(comment => {
        comments.push(
          <PostComment commentData={ comment } 
          deleteComment={ () => this.showConfirmModal(
            'Delete comment',
            'Are you sure you want to delete this comment?',
            'Delete',
            () => this.deleteComment(comment._id)
          )}
          updateComment={this.updateComment}/>
        );
      })
      return <React.Fragment>
        <Container fluid>
          { comments.length ? comments : <Alert variant="secondary">No comments yet</Alert> }
          <CommentForm postId={this.props.postData._id} 
          publishComment={this.publishComment} 
          hideComments={this.toggleComments}/>
        </Container>
      </React.Fragment>
    }
    else{
      return null;
    }
  }

  async toggleComments(){
    if(!this.state.postComments.length){
      let req = await request.getPostComments(this.props.postData._id);
      if(req.success){
        this.setState({
          postComments: req.data
        });
      }
      else{
        console.log(req.error)
        //TODO - Exibir erro de carregamento dos comentários
      }
    }
    this.setState({
      showComments: !this.state.showComments
    })
  }

  toggleShareModal(){
    this.setState({
      showShareModal: !this.state.showShareModal
    })
  }

  renderMiniPost(nickname, authorPictureUrl, text, tags, pictureUrl){
    return <Media className="my-minipost">
        <ProfilePicture nickname={nickname}
          url={authorPictureUrl} 
          size="small" />
        <Media.Body>
          { this.renderPostTags(tags) }
          <p className="my-post-text">
            { text }
          </p>
          { this.renderPostPhoto(pictureUrl) }
        </Media.Body>
      </Media>
  }

  closeConfirmModal(){
    this.setState({
      showConfirmModal: false
    })
  }

  showConfirmModal(title, message, action, funct){
    this.setState({
      showConfirmModal: true,
      confirmModalData: {
        title,
        message,
        action,
        funct
      }
    })
  }

  renderLikeds(props){
    let likes = [];
    const likesQty = this.props.postData.likedBy.length;
    for(let i = 0; i < 20; i++){
      let user = this.props.postData.likedBy[i];
      if(i < likesQty){
        likes.push(
          <div>{user.nickname}</div>
        )
      }
    }
    if(likesQty > 20){
      likes.push(<div>{`...and ${likesQty-20} more`}</div>);
    }
    return <Tooltip {...props}>
      { likes }
    </Tooltip>
  }

  renderUnlikeds(props){
    let unlikes = [];
    const unlikesQty = this.props.postData.unlikedBy.length;
    for(let i = 0; i < 20; i++){
      let user = this.props.postData.unlikedBy[i];
      if(i < unlikesQty){
        unlikes.push(
          <div>{user.nickname}</div>
        )
      }
    }
    if(unlikesQty > 20){
      unlikes.push(<div>{`...and ${unlikesQty-20} more`}</div>);
    }
    return <Tooltip {...props}>
      { unlikes }
    </Tooltip>
  }

  renderConfirmModal(title, message, action, funct = this.closeConfirmModal){
    return <React.Fragment>
      <Modal show={this.state.showConfirmModal} onHide={this.closeConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { message }
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-between">
            <Col md={3} className="pl-sm-0 mb-3">
              <Button variant="secondary" onClick={this.closeConfirmModal} block>
                Cancel
              </Button>
            </Col>
            <Col md={3} className="pr-sm-0">
              <Button variant="primary" onClick={funct} block>
                {action}
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  }

  renderShareModal(){
    return <React.Fragment>
      <Modal show={this.state.showShareModal} onHide={this.toggleShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderShareForm() }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.toggleShareModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.sharePost}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
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
            <ProfilePicture nickname={this.props.postData.author.nickname}
              url={this.state.authorPictureUrl} size="medium" tabletDesktopOnly/>
            <Media.Body>
              <Row className="justify-content-end mb-2">
                <Col className="d-flex align-items-start flex-row">
                  <ProfilePicture nickname={this.props.postData.author.nickname}
                    pictureId={this.props.postData.author.profilePicture}
                    size="medium" mobileOnly/>
                  <div>
                    <a href={ this.getProfilePageUrl() } className="my-post-author-name">
                      <strong>{ this.props.postData.author.nickname }</strong>
                    </a>
                    { 
                      this.props.postData.sharedFrom ? 
                      <React.Fragment>
                        {' '}shared from{' '} 
                        <a href={"/profile/" + this.props.postData.author.nickname} 
                        className="my-post-author-name">
                          <strong>{ this.props.postData.sharedFrom.author.nickname }</strong>
                        </a>
                      </React.Fragment>
                      : null 
                    }
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
                { this.renderPostTags(this.props.postData.tags) }
                <p className="my-post-text">
                  { this.props.postData.text }
                </p>
                { 
                  this.props.postData.sharedFrom ? 
                  this.renderMiniPost(
                    this.props.postData.sharedFrom.author.nickname,
                    this.state.minipostAuthorPictureUrl,
                    this.props.postData.sharedFrom.text,
                    this.props.postData.sharedFrom.tags,
                    this.state.minipostPictureUrl
                  ) : 
                  this.renderPostPhoto(this.state.postPictureUrl) 
                }
              </Col>
              </Row>
              { this.renderComments() }
            </Media.Body>
          </Media>
          <Row className="justify-content-end my-post-buttons">
            <Col xs="auto">
              <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={this.renderLikeds}>
                <Button onClick={ this.likeClick }
                variant={this.liked() ? "dark" : "outline-dark"} >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  { this.renderLikesQty() }
                </Button>
              </OverlayTrigger>
              {' '}
              <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={this.renderUnlikeds}>
                <Button onClick={ this.unlikeClick }
                variant={this.unliked() ? "dark" : "outline-dark"} >
                  <FontAwesomeIcon icon={faThumbsDown} />
                  { this.renderUnlikesQty() }
                </Button>
              </OverlayTrigger>
              {' '}
              <Button variant="outline-dark" onClick={ this.toggleComments }>
                <FontAwesomeIcon icon={faComment} />
                  { ' ' + this.props.postData.commentsTotal }
              </Button>{' '}
              <Button variant="outline-dark" onClick={ this.toggleShareModal }>
                <FontAwesomeIcon icon={faShare} />
              </Button>
            </Col>
          </Row>
          {
            this.renderShareModal()
          }
          {
            this.renderConfirmModal(
              this.state.confirmModalData.title,
              this.state.confirmModalData.message,
              this.state.confirmModalData.action,
              this.state.confirmModalData.funct,
            )
          }
        </React.Fragment>
        }
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Post);