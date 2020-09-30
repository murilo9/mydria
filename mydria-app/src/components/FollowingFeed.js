import React, { Component } from 'react';
import request from '../services/request.js';
import { connect } from 'react-redux';

import ListGroup from 'react-bootstrap/esm/ListGroup';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import ProfilePicture from './ProfilePicture.js';

const mapStateToProps = state => ({
  ...state
})

class FollowingFeed extends Component {
  
  constructor(props){
    super(props);
    this.renderFollowedUsers = this.renderFollowedUsers.bind(this);
  }

  renderFollowedUsers(){
    let following = [];
    this.props.user.following.forEach(followedUser => {
      following.push(
        <ListGroup.Item key={followedUser.nickName}>
          <ProfilePicture nickname={followedUser.nickname}
            pictureId={followedUser.profilePicture} 
            size="small" />
          <a href={"/profile/" + followedUser.nickname} className="my-post-author-name">
            <strong>{followedUser.nickname}</strong>
          </a>
        </ListGroup.Item>
      )
    })
    return following;
  }

  render() {
    console.log(this.props.user)
    return (
      <Col sm={3} className="my-following-feed d-none d-sm-block">
        <p>
          { this.props.user.following.length ? 
          'People you follow' : "You're not following anybody yet" }
        </p>
        <ListGroup variant="flush">
          { this.renderFollowedUsers() }
        </ListGroup>
      </Col>
    )
  }
}

export default connect(mapStateToProps)(FollowingFeed);