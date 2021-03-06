import React, { Component } from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import 
{ 
  setDarkTheme,
  setSessionActive, 
  setSessionUserId, 
  setSessionToken,
  setUserNickname,
  setUserFollowing,
  setUserFollowedBy,
  setUserProfilePicture,
  setUserEmail,
  unsetUser
} from '../actions';

export function mapStateToProps(state){
  return {...state}
}

export function mapDispatchToProps(dispatch){
  return {
    setDarkTheme: active => dispatch(setDarkTheme(active)),
    setSessionActive: active => dispatch(setSessionActive(active)),
    setSessionUserId: userId => dispatch(setSessionUserId(userId)),
    setSessionToken: token => dispatch(setSessionToken(token)),
    setUserEmail: email => dispatch(setUserEmail(email)),
    setUserNickname: nickname => dispatch(setUserNickname(nickname)),
    setUserFollowing: following => dispatch(setUserFollowing(following)),
    setUserFollowedBy: followedBy => dispatch(setUserFollowedBy(followedBy)),
    setUserProfilePicture: profilePic => dispatch(setUserProfilePicture(profilePic)),
    unsetUser: () => dispatch(unsetUser())
  }
}

export class MydriaPage extends Component {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.sessionInit = this.sessionInit.bind(this);
    this.toggleDarkTheme = this.toggleDarkTheme.bind(this);
    this.getPageClasses = this.getPageClasses.bind(this);
  }

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
      const following = session.userData.following;
      const followedBy = session.userData.followedBy;
      const userId = session.userData._id;
      const darkTheme = Cookies.get('darkTheme') === 'true' ? true : false;
      this.sessionInit(token, userId, email, nickname, 
        following, followedBy, profilePicture, darkTheme);
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
  sessionInit(token, userId, email, nickname, following, followedBy, profilePicture, darkTheme){
    this.props.setSessionActive(true);
    this.props.setSessionUserId(userId);
    this.props.setSessionToken(token);
    this.props.setUserEmail(email);
    this.props.setUserNickname(nickname);
    this.props.setUserFollowing(following);
    this.props.setUserFollowedBy(followedBy);
    this.props.setUserProfilePicture(profilePicture);
    this.props.setDarkTheme(darkTheme);
  }

  /**
   * Limpa os cookies e a store pra realizar logout.
   */
  logout(){
    Cookies.remove('token');
    Cookies.remove('userId');
    this.props.setSessionActive(false);
    this.props.unsetUser();
    this.setState({ sessionExpired: true });
  }
  
  getDarkTheme(){
    return this.props.session.darkTheme ? " my-dark-theme" : "";
  }

  getPageClasses(){
    return "my-page-container" + (this.props.session.darkTheme ? " dark-theme" : "");
  }

  toggleDarkTheme(){
    let darkTheme = this.props.session.darkTheme;
    Cookies.set('darkTheme', !darkTheme);
    this.props.setDarkTheme(!darkTheme);
    this.setState({});
  }
}