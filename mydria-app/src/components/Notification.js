import React from 'react';
import { connect } from 'react-redux';
import {  mapStateToProps } from '../pages/base';

import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfilePicture from './ProfilePicture.js';


class Notification extends React.Component {

  constructor(props){
    super(props);
    this.getLabel = this.getLabel.bind(this);
  }

  getLabel(){
    let label = 'unknown type';
    switch(this.props.data.type){
      case 'POST_LIKED':
        label = ' liked your post.';
        break;
      case 'POST_UNLIKED':
        label = ' unliked your post.';
        break;
      case 'POST_COMMENTED':
        label = ' commented on your post.';
        break;
      case 'POST_SHARED':
        label = ' shared your post.';
        break;
      case 'FOLLOW':
        label = ' started following you.';
        break;
    }
    return <React.Fragment>
      <strong>{this.props.data.from.nickname}</strong>
      { label }
    </React.Fragment>;
  }
  
  getDateLabel(){
    let now = new Date();
    let event = new Date(this.props.data.date);
    //Se o evento ocorreu hoje
    if(now.getDate() === event.getDate() && now.getMonth() === event.getMonth() &&
    now.getFullYear() === event.getFullYear()){
      let mins = (now.getTime() - event.getTime()) / 1000 / 60;
      mins = Math.floor(mins);
      return mins + ' min';
    }
    else {
      return event.toDateString();
    }
  }

  getHref(){
    return this.props.data.type === 'FOLLOW' ? 
    `/profile/${this.props.data.from.nickname}` 
    : `/post/${this.props.data.post._id}`;
  }

  render(){
    return <NavDropdown.Item href={this.getHref()} className="d-flex align-center w-100">
      <ProfilePicture 
        nickname={this.props.data.from.nickname} 
        pictureId={this.props.data.from.profilePicture}
        size="tiny"
      />
      <div className="h-1rem d-flex flex-column">
        <span>{ this.getLabel() }</span>
        <span className="my-notification-date">{ this.getDateLabel() }</span>
      </div>
    </NavDropdown.Item>
  }
}

export default connect(mapStateToProps)(Notification);