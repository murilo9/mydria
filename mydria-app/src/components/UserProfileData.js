import React, { Component } from 'react';
import request from '../services/request.js';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

function mapStateToProps(state){
  return {...state}
}

export class UserProfileData extends Component {

  constructor(props){
    super(props);
    this.renderBio = this.renderBio.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.ownProfile = this.ownProfile.bind(this);
  }

  ownProfile(){
    return this.props.userData.nickname === this.props.user.nickname;
  }

  renderBio(){
    return (
      this.props.userData.bio ?
      <Card.Text className="my-profile-data-bio">
        { this.props.userData.bio }
      </Card.Text>
      : null
    )
  }

  renderLocation(){
    return (
      this.props.userData.country ?
      <Card.Text>
        <FontAwesomeIcon icon={faMapMarkerAlt} className="my-profile-data-icon"/>{' '}
        { this.props.userData.city ? 
        this.props.userData.city + ', ' : null }
        { this.props.userData.country }
      </Card.Text>
      : null
    )
  }

  renderFollowButton(){
    if(!this.ownProfile()){
      return (
        this.props.following ? 
        <Button variant="success" onClick={this.props.unfollowClick} block>
          Unfollow
        </Button>
        :
        <Button variant="primary" onClick={this.props.followClick} block>
          Follow
        </Button>
      )
    }
    else{
      return null;
    }
  }

  render(){
    return (
      <Card className="mb-3">
        <div className="my-profile-picture-wrapper">
          <div className="my-profile-picture" 
          style={{backgroundImage: 'url(/assets/user.svg)'}}></div>
        </div>
        <Card.Body>
          <Card.Title className="my-profile-data-title">
            { this.props.userData.nickname }
          </Card.Title>
          { this.renderBio() }
          { this.renderLocation() }
          <Card.Text>
            <FontAwesomeIcon icon={faUsers} className="my-profile-data-icon"/>{' '}
            { this.props.userData.followedBy.length + ' follower' + 
            (this.props.userData.followedBy.length === 1 ? '' : 's') }
          </Card.Text>
          { this.renderFollowButton() }
        </Card.Body>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(UserProfileData);