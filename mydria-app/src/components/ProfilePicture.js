import React, { Component } from 'react';
import request from '../services/request.js';

import ListGroup from 'react-bootstrap/esm/ListGroup';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

const mapStateToProps = state => ({
  ...state
})

export default class ProfilePicture extends Component {

  /**
   * Props:
   *  size: String - tiny || small || medium
   *  noMargin: Boolean - Aplica ou remove a classe mr-3 do bootstrap
   *  mobileOnly: Boolean - Oculta a foto em tablet/desktop
   *  tabletDesktopOnly: Boolean - Oculta a foto no celular
   */
  constructor(props){
    super(props);
  }

  getClasses(){
    let classes = "my-profile-picture-wrapper";
    classes += this.props.noMargin ? '' : ' mr-3';
    classes += ` ${this.props.size}`;   // tiny || small || medium
    if(this.props.mobileOnly){
      classes += " d-inline-block d-sm-none"
    }
    else if(this.props.tabletDesktopOnly){
      classes += " d-none d-sm-inline-block"
    }
    if(this.props.block){
      classes += " block"
    }
    return classes;
  }

  pictureUrl(){
    return request.resolveImageUrl(this.props.pictureId);
  }

  render(){
    return <div className={this.getClasses()}>
      <a className="my-profile-picture" href={"/profile/" + this.props.nickname}
        style={{backgroundImage: `url(${this.pictureUrl()})`}}></a>
    </div>
  }
}