import React from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import MydriaPage from './base';
import actionTypes, 
{ 
  setPageData, 
  setSessionActive, 
  setSessionUserId, 
  setSessionToken,
  setUserNickname,
  setUserProfilePicture,
  setUserEmail,
  unsetUser
} from '../actions';

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  setPageData: data => dispatch(setPageData(data)),
  setSessionActive: active => dispatch(setSessionActive(active)),
  setSessionUserId: userId => dispatch(setSessionUserId(userId)),
  setSessionToken: token => dispatch(setSessionToken(token)),
  setUserEmail: email => dispatch(setUserEmail(email)),
  setUserNickname: nickname => dispatch(setUserNickname(nickname)),
  setUserProfilePicture: profilePic => dispatch(setUserProfilePicture(profilePic)),
  unsetUser: () => dispatch(unsetUser())
})

class ProfilePage extends MydriaPage {

  constructor(props){
    super(props);
    console.log('profile constructor')
  }

  loadPageData(){

  }

  render(){
    return <h1>Profile</h1>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)