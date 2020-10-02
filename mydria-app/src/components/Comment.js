import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faMinusSquare, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProfilePicture from './ProfilePicture.js';

const mapStateToProps = state => ({
  ...state
})

class PostComment extends Component {

  constructor(props){
    super(props);
    this.state = {
      editing: false
    }
    this.getProfilePageUrl = this.getProfilePageUrl.bind(this);
    this.isAuthor = this.isAuthor.bind(this);
    this.editComment = this.editComment.bind(this);
    this.uneditComment = this.uneditComment.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.renderEditForm = this.renderEditForm.bind(this);
    this.getId = this.getId.bind(this);
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
      <Dropdown.Item href="#" onClick={ this.props.deleteComment }>
        <FontAwesomeIcon icon={faTrashAlt} /> Delete
      </Dropdown.Item>
    </React.Fragment>
    :
    <Dropdown.Item href="#">
      <FontAwesomeIcon icon={faMinusSquare} /> Hide this
    </Dropdown.Item>
  }

  editComment(){
    let commentText = this.props.commentData.text;
    this.setState({
      editing: true
    })
    setTimeout(() => {
      let commentTextarea = document.getElementById('edit-comment-form-' + this.getId());
      commentTextarea.value = commentText;
    }, 10)
  }

  uneditComment(){
    this.setState({
      editing: false
    })
  }

  async saveChanges(){
    let updatedComment = {...this.props.commentData};
    const updatedText = document.getElementById('edit-comment-form-' + this.getId()).value;
    updatedComment.text = updatedText;
    let res = await request.updateComment(updatedComment);
    if(res.success){
      this.props.updateComment(res.data, () => {
        this.uneditComment();
      });
    }
    else{
      console.log(res.error)
      //TODO - Tratamento adequado de erro ao atualizar comentário
    }
  }

  getId(){
    return this.props.commentData._id;
  }

  renderEditForm(){
    return <Form>
      <Form.Group>
        <Form.Control as="textarea" rows="3" id={'edit-comment-form-'+this.getId()}
        placeholder="Leave a comment"/>
      </Form.Group>
      <Row className="mb-3 justify-content-end">
        <Col sm="auto">
          <Button variant="secondary" onClick={this.uneditComment}>
            Cancel
          </Button>
          {' '}
          <Button variant="info" onClick={this.saveChanges}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  }

  isAuthor(){
    return this.props.commentData.author._id === this.props.session.userId;
  }

  render() {
    return this.state.editing ?
      this.renderEditForm()
      :
      <Media>
        <ProfilePicture nickname={this.props.commentData.author.nickname}
          pictureId={this.props.commentData.author.profilePicture} 
          size="small" />
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
  }
}

export default connect(mapStateToProps)(PostComment);