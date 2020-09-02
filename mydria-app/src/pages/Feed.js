import React from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { MydriaPage, mapStateToProps, mapDispatchToProps } from './base';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import Topbar from '../components/Topbar';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import FollowingFeed from '../components/FollowingFeed';

class FeedPage extends MydriaPage {
  constructor(props){
    super(props);
    this.state = {
      posts: [],
      sessionExpired: false,  //Renderiza um objeto <Redirect> para voltar à página de login
      loadingPosts: true    //Renderiza um spinner enquanto posts estiverem sendo carregados
    }
    this.loadPageData = this.loadPageData.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.appendPost = this.appendPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  /**
   * Carrega alguns posts para exibir no feed do usuário.
   */
  async loadPageData(){
    const posts = await request.loadSomePosts();
    this.setState({
      loadingPosts: false,
      posts
    })
  }

  appendPost(post){
    let posts = this.state.posts;
    posts.unshift(post);
    this.setState({
      posts
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
    callback();
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
      this.state.posts.forEach(post => {
        posts.push(
        <Post postData={post} 
        updatePost={this.updatePost} 
        deletePost={this.deletePost}
        key={post._id} 
        />)
      })
      return posts;
    }
  }

  render(){
    //Caso a session tenha expirado durante o runtime, redireciona:
    if(this.state.sessionExpired){
      return <Redirect to="/" />
    }
    //Caso contrário, renderiza a página normalmente:
    else{
      return (
        <Container fluid className="my-no-padding">
          <Topbar logout={this.logout}/>
          <Container className="my-page-container">
            <Row>
              <Col sm={2} className="my-ads d-none d-sm-flex">Ads</Col>
              <Col xs={12} sm={7}>
                <PostForm appendPost={this.appendPost} />
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