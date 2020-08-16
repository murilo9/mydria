import React, { Component } from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';

export default class MydriaPage extends Component {

  /**
   * Quando a view for montada, pega o token dos cookies e verifica se
   * a session é válida e ainda está ativa.
   */
  async componentDidMount() {
    let token = Cookies.get('token');
    const session = await request.validateSession(token);
    //Se a session é válida e está ativa:
    if(session.active){
      //Grava os dados da session no store:
      const token = Cookies.get('token');
      const email = session.userData.email;
      const nickname = session.userData.nickname;
      const profilePicture = session.userData.profilePicture;
      const userId = session.userData._id;
      this.sessionInit(token, userId, email, nickname, profilePicture);
      this.loadPageData();
    }
    //Se a session não é válida ou expirou:
    else{
      this.logout();    //Faz logout:
    }
  }

  /**
   * @desc Recebe o token, o ID e os dados do usuário pra realizar os dispatches 
   * no store pra setar a session.
   * @param {String} token 
   * @param {String} userId 
   */
  sessionInit(token, userId, email, nickname, profilePicture){
    this.props.setSessionActive(true);
    this.props.setSessionUserId(userId);
    this.props.setSessionToken(token);
    this.props.setUserEmail(email);
    this.props.setUserNickname(nickname);
    this.props.setUserProfilePicture(profilePicture);
  }

  /**
   * Limpa os cookies e a store pra realizar logout.
   */
  logout(){
    Cookies.remove('token');
    Cookies.remove('userId');
    this.props.setPageData({});
    this.props.setSessionActive(false);
    this.props.unsetUser();
    this.setState({ sessionExpired: true });
  }
}