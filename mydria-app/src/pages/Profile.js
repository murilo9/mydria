import React from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { MydriaPage, mapDispatchToProps, mapStateToProps } from './base';
import { setUserFollowing } from '../actions';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import Topbar from '../components/Topbar';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserProfileData from '../components/UserProfileData';

import NotFound from './NotFound';

class ProfilePage extends MydriaPage {

  constructor(props){
    super(props);
    this.state = {
      posts: [],
      userData: {},
      following: false,
      loadPostsError: false,  //Renderiza mensagem de erro em caso de falha ao carregar os posts
      notFound: true,  //Redireciona pra página de 404 caso o usuário não exista
      loadingUserData: true,  //Deixa a tela branca enquanto os dados do usuário estiverem sendo carregados
      loadingPosts: true    //Renderiza um spinner enquanto posts estiverem sendo carregados
    }
    this.ownProfile = this.ownProfile.bind(this);
    this.loadPageData = this.loadPageData.bind(this);
    this.followClick = this.followClick.bind(this);
    this.unfollowClick = this.unfollowClick.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.isFollowing = this.isFollowing.bind(this);
    this.appendPost = this.appendPost.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.getDarkTheme = this.getDarkTheme.bind(this);
  }

  ownProfile(){
    return this.state.userData.nickname === this.props.user.nickname;
  }

  isFollowing(){
    //Pega a lista de pessoas que você segue:
    const following = this.props.user.following;
    //Pega o id do perfil:
    const profileId = this.state.userData._id;
    //Verifica se o id do perfil está na lista de pessoas que você segue:
    for(let i = 0; i < following.length; i++){
      let followed = following[i];
      if(followed === profileId){
        return true;
      }
    }
    return false;
  }

  async loadPageData(){
    const { nickname } = this.props.match.params;
    const userReq = await request.getUserData(nickname);
    this.setState({
      userData: userReq.success ? userReq.userData : null,
      notFound: !userReq.success,    //Se acou o usuário, então notFound = false
      loadingUserData: false
    })
    //Se o usuário foi encontrado, carrega os posts:
    if(userReq.success){
      const userId = userReq.userData._id;
      let postsReq = await request.getUserPosts(userId);
      if(postsReq.success){
        this.setState({
          posts: postsReq.posts,
          loadingPosts: false,
          following: this.isFollowing()
        })
      }
      else{
        //Caso haja falha na requisição
        this.setState({
          loadingPosts: false,
          loadPostsError: true
        })
      }
    }
  }

  async followClick(){
    let req = await request.followUser(this.state.userData._id);
    if(req.success){
      let following = this.props.user.following;
      let followedBy = this.state.userData.followedBy;
      const profileId = this.state.userData._id;
      const userId = this.props.session.id;
      following.push(profileId);
      followedBy.push(userId);
      this.props.setUserFollowing(following);
      this.setState({
        following: this.isFollowing(),
        userData: {...this.state.userData, followedBy}
      })
    }
  }

  async unfollowClick(){
    let req = await request.unfollowUser(this.state.userData._id);
    if(req.success){
      let following = this.props.user.following;
      let followedBy = this.state.userData.followedBy;
      const profileId = this.state.userData._id;
      const userId = this.props.session.id;
      let profileIndex = following.indexOf(profileId);
      let userIndex = followedBy.indexOf(userId);
      if(profileIndex >= 0){
        following.splice(profileIndex, 1);
      }
      if(userIndex >= 0){
        followedBy.splice(userIndex, 1);
      }
      this.props.setUserFollowing(following);
      this.setState({
        following: this.isFollowing(),
        userData: {...this.state.userData, followedBy}
      })
    }
  }

  updateUserData(userData){
    this.setState({
      userData: {
        ...this.state.userData,
        ...userData
      }
    })
  }

  /**
   * Atualiza os dados de um post sendo exibido na página.
   * @param {*} post Post com os dados atualizados
   */
  updatePost(post, callback){
    let posts = [...this.state.posts];
    //Procura o post na lista de posts do feed:
    for(let p = 0; p < posts.length; p++){
      let existingPost = posts[p];
      if(existingPost._id === post._id){
        posts.splice(p, 1, post);
        break;
      }
    }
    //Atualiza a lista de posts do feed:
    this.setState({ posts });
    if(typeof callback === 'function'){
      callback();
    }
  }

  deletePost(postId){
    let posts = [...this.state.posts];
    //Procura o post na lista de posts do feed:
    for(let p = 0; p < posts.length; p++){
      let existingPost = posts[p];
      if(existingPost._id === postId){
        posts.splice(p, 1);
        break;
      }
    }
    //Atualiza a lista de posts do feed:
    this.setState({ posts });
  }

  appendPost(post){
    let posts = this.state.posts;
    posts.unshift(post);
    this.setState({
      posts
    })
  }

  getDarkTheme(){
    return this.props.session.darkTheme ? " my-dark-theme" : "";
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
    else if(this.state.loadPostsError){
      return <Alert className="justify-content-center" variant="danger">
        There was an error while loading the posts 🤦‍♂️
      </Alert>
    }
    else{
      let posts = [];
      if(this.state.posts){
        this.state.posts.forEach(post => {
          posts.push(
            <Post postData={post} 
            updatePost={this.updatePost} 
            deletePost={this.deletePost}
            key={post._id} />
          )
        })
      }
    return posts.length ? posts : 
    <h3 className="ta-center">No posts yet...</h3>;
    }
  }

  renderPostForm(){
    return this.ownProfile() ? <PostForm appendPost={this.appendPost} /> : null;
  }

  render(){
    //Caso a session tenha expirado durante o runtime, redireciona:
    if(this.state.sessionExpired){
      return <Redirect to="/" />
    }
    //Caso ainda esteja carregando os dados do usuário do servidor:
    else if(this.state.loadingUserData){
      return <span></span>;
    }
    //Caso o usuário não exista, renderiza a página 404:
    else if(this.state.notFound){
      return <NotFound />
    }
    //Caso contrário, renderiza a página normalmente:
    else{
      return <Container fluid className={"my-no-padding" + this.getDarkTheme()}>
      <Topbar logout={this.logout} toggleDarkTheme={this.toggleDarkTheme}/>
      <Container className={this.getPageClasses()}>
        <Row>
          <Col sm={4} lg={3}>
            <UserProfileData 
            userData={this.state.userData} 
            following={this.state.following}
            loading={this.state.loadingUserData} 
            followClick={this.followClick}
            unfollowClick={this.unfollowClick} 
            updateUserData={this.updateUserData}/>
          </Col>
          <Col xs={12} sm={8} lg={7} className="my-content-col pl-sm-0 pt-1 h-100">
            { this.renderPostForm() }
            { this.renderPosts() }
          </Col>
          <Col lg={2} className="d-none d-lg-flex pr-0">
            <div className="my-ads pl-2">Ads</div>
          </Col>
        </Row>
      </Container>
    </Container>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)