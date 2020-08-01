import React, { Component } from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Topbar from '../components/Topbar';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import FollowingFeed from '../components/FollowingFeed';

import actionTypes, 
{ 
  setPageData, 
  setSessionActive, 
  setSessionId, 
  setSessionToken
} from '../actions';

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  setPageData: data => dispatch(setPageData(data)),
  setSessionActive: active => dispatch(setSessionActive(active)),
  setSessionId: id => dispatch(setSessionId(id)),
  setSessionToken: token => dispatch(setSessionId(token))
})

class FeedPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      sessionExpired: false
    }
    this.logout = this.logout.bind(this);
    this.sessionInit = this.sessionInit.bind(this);
  }

  async componentDidMount() {
    let token = Cookies.get('token');
    const session = await request.validateSession(token);
    //Se a session é válida e está ativa:
    if(session.active){
      console.log(session.userData)
      //Grava os dados da session no store:
      const token = Cookies.get('token');
      const id = session._id;
      this.sessionInit(token, id);
    }
    //Se a session não é válida ou expirou:
    else{
      //Faz logout:
      this.logout();
    }
  }

  /**
   * @desc Recebe o token e o ID e realiza os dispatches no store pra setar a session.
   * @param {*} token 
   * @param {*} id 
   */
  sessionInit(token, id){
    this.props.setSessionActive(true);
    this.props.setSessionId(id);
    this.props.setSessionToken(token);
  }

  logout(){
    Cookies.remove('token');
    Cookies.remove('userId');
    //TODO: limpar store
    this.setState({ sessionExpired: true });
  }

  render(){
    if(this.state.sessionExpired){
      return <Redirect to="/login" />
    }
    else{
      return (
        <Container fluid className="my-no-padding">
          <Topbar logout={this.logout}/>
          <Container className="my-page-container">
            <Row>
              <Col xs={2} className="my-ads">Ads</Col>
              <Col xs={7}>
                <PostForm />
                <Post />
              </Col>
              <FollowingFeed />
            </Row>
          </Container>
        </Container>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);