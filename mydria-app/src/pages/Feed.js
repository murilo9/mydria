import React, { Component } from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import Topbar from '../components/Topbar';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import FollowingFeed from '../components/FollowingFeed';

import actionTypes, 
{ 
  setPageData, 
  setSessionActive, 
  setSessionUserId, 
  setSessionToken,
  setUserNickname,
  setUserProfilePicture,
  setUserEmail
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
})

class FeedPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      sessionExpired: false,
      loadingPosts: true
    }
    this.logout = this.logout.bind(this);
    this.sessionInit = this.sessionInit.bind(this);
    this.loadPosts = this.loadPosts.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
  }

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
      this.loadPosts();
    }
    //Se a session não é válida ou expirou:
    else{
      //Faz logout:
      this.logout();
    }
  }

  /**
   * @desc Recebe o token e o ID e realiza os dispatches no store pra setar a session.
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

  logout(){
    Cookies.remove('token');
    Cookies.remove('userId');
    //TODO: limpar store
    this.setState({ sessionExpired: true });
  }

  async loadPosts(){
    const feedPosts = await request.loadSomePosts();
    this.props.setPageData({ feedPosts });    //Salva os posts no store
    this.setState({
      loadingPosts: false
    })
  }

  renderPosts(){
    if(this.state.loadingPosts){
      return (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      )
    }
    else{
      let posts = [];
      if(this.props.page.feedPosts){
        this.props.page.feedPosts.forEach(post => {
          posts.push(<Post data={post} key={post._id} />)
        })
      }
      return posts;
    }
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
                { this.renderPosts() }
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