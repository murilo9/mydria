import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faMinusSquare, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const mapStateToProps = state => ({
  ...state
})

class PostComment extends Component {

  constructor(props){
    super(props);
    this.state = {
      userPictureUrl: request.resolveImageUrl(props.commentData.author.profilePicture)
    }
    this.getProfilePageUrl = this.getProfilePageUrl.bind(this);
    this.isAuthor = this.isAuthor.bind(this);
    this.editComment = this.editComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  editComment(){
    //TODO
  }

  async deleteComment(){
    let res = await request.deleteComment(this.props.commentData._id);
    if(res.success){
      this.props.deleteComment(this.props.commentData._id);
    }
    else{
      console.log(res.error);
      //TODO - Tratamento de erro ao deletar comentário
    }
  }

  getProfilePageUrl(){
    return '/profile/' + this.props.commentData.author.nickname;
  }

  renderCommentDate(){
    let date = new Date(this.props.commentData.date);
    return date.toDateString();
  }

  renderActions(){
    return this.isAuthor() ?
    <React.Fragment>
      <Dropdown.Item href="#" onClick={ this.editComment }>
        <FontAwesomeIcon icon={faEdit} /> Edit
      </Dropdown.Item>
      <Dropdown.Item href="#" onClick={ this.deleteComment }>
        <FontAwesomeIcon icon={faTrashAlt} /> Delete
      </Dropdown.Item>
    </React.Fragment>
    :
    <Dropdown.Item href="#">
      <FontAwesomeIcon icon={faMinusSquare} /> Hide this
    </Dropdown.Item>
  }

  isAuthor(){
    return this.props.commentData.author._id === this.props.session.userId;
  }

  render() {
    return <React.Fragment>
      <Media>
        <div className="my-profile-picture-wrapper comment mr-3 d-none d-sm-block">
          <a className="my-profile-picture" 
          href={"/profile/" + this.props.commentData.author.nickname}
          style={{backgroundImage: `url(${this.state.userPictureUrl})`}}></a>
        </div>
        <Media.Body>
          <Row className="justify-content-end mb-2">
            <Col>
              <div>
                <a href={ this.getProfilePageUrl() } className="my-post-author-name">
                  <strong>{ this.props.commentData.author.nickname }</strong>
                </a>
                <div className="my-post-date">
                  { this.renderCommentDate() }
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <Dropdown className="my-post-options" alignRight>
                {' '}
                <Dropdown.Toggle variant="outline-dark" 
                className="my-post-options-button"
                id={"my-post-options-button-" + this.props.commentData._id}>
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
              <p className="my-post-text">
                { this.props.commentData.text }
              </p>
            </Col>
          </Row>
        </Media.Body>
      </Media>
    </React.Fragment>
  }
}

export default connect(mapStateToProps)(PostComment);