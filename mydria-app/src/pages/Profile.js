import React from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { MydriaPage, mapDispatchToProps, mapStateToProps } from './base';

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