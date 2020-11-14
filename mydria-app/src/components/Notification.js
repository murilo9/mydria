import React from 'react';
import { connect } from 'react-redux';
import {  mapStateToProps } from '../pages/base';

import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfilePicture from './ProfilePicture.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Notification extends React.Component {

  constructor(props){
    super(props);
    this.getLabel = this.getLabel.bind(this);
    this.state = {
      months: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
    }
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
      let day = event.getDate();
      let month = this.state.months[event.getMonth()];
      let hours = event.getHours();
      let mins = event.getMinutes();
      return `${month} ${day} - ${hours > 9 ? hours : '0'+hours}:${mins > 9 ? mins : '0'+mins}`;
    }
  }

  getHref(){
    return this.props.data.type === 'FOLLOW' ? 
    `/profile/${this.props.data.from.nickname}` 
    : `/post/${this.props.data.post._id}`;
  }

  render(){
    return <NavDropdown.Item href={this.getHref()} 
    className="my-notification d-flex align-center w-100">
      <Row noGutters className="w-100">
        <Col xs={2}>
          <ProfilePicture 
            nickname={this.props.data.from.nickname} 
            pictureId={this.props.data.from.profilePicture}
            size="tiny"
            noMargin={true}
          />
        </Col>
        <Col xs={10}>
          <div className="my-notification-label">{ this.getLabel() }</div>
          <div className="my-notification-date">{ this.getDateLabel() }</div>
        </Col>
      </Row>
    </NavDropdown.Item>
  }
}

export default connect(mapStateToProps)(Notification);