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
   *  nickname - Nickname de quem a foto vai ser exibida (usado pra gerar o link pro perfil)
   *  pictureId - Id da picture que vai ser exibida
   *  size: String - tiny || small || medium || max
   *  noMargin: Boolean - Aplica ou remove a classe mr-3 do bootstrap
   *  mobileOnly: Boolean - Oculta a foto em tablet/desktop
   *  tabletDesktopOnly: Boolean - Oculta a foto no celular
   *  handleClick: Function - Função de handle de clique
   *  square: Boolean - Diz se a foto é pra ser qudrada (redondo é o default)
   */
  constructor(props){
    super(props);
    this.getHref = this.getHref.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getClasses(){
    let classes = "my-profile-picture-wrapper";
    classes += this.props.noMargin ? '' : ' mr-3';
    classes += ` ${this.props.size}`;   // tiny || small || medium || max
    if(this.props.mobileOnly){
      classes += " d-inline-block d-sm-none";
    }
    else if(this.props.tabletDesktopOnly){
      classes += " d-none d-sm-inline-block";
    }
    if(this.props.block){
      classes += " block";
    }
    return classes;
  }

  pictureUrl(){
    return request.resolveImageUrl(this.props.pictureId);
  }

  getHref(){
    return this.props.size === 'max' ? '#' : "/profile/" + this.props.nickname;
  }

  handleClick(e){
    e.preventDefault();
    if(typeof this.props.handleClick === 'function'){
      this.props.handleClick();
    }
  }

  render(){
    return <div className={this.getClasses()}>
      {
        this.props.size === 'max' ? 
        <a className={"my-profile-picture" + (this.props.square ? " square" : "")} 
        style={{backgroundImage: `url(${this.pictureUrl()})`}}
        href="" onClick={e => this.handleClick(e)}
        ></a>
        :
        <a className={"my-profile-picture" + (this.props.square ? " square" : "")} 
        href={this.getHref()} style={{backgroundImage: `url(${this.pictureUrl()})`}}
        ></a>
      }
    </div>
  }
}