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
        <ListGroup.Item key={followedUser.nickName} className="pr-1 pr-md-2 pl-r pl-md-2">
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
    return (
      <div className="my-following-feed">
        <p>
          { this.props.user.following.length ? 
          'People you follow' : "You're not following anybody yet" }
        </p>
        <ListGroup variant="flush">
          { this.renderFollowedUsers() }
        </ListGroup>
      </div>
    )
  }
}

export default connect(mapStateToProps)(FollowingFeed);