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
      searchString: '',
      searchResult: false,    //Indica se está sendo exibido o resultado de uma busca
      sessionExpired: false,  //Renderiza um objeto <Redirect> para voltar à página de login
      loadingPosts: true    //Renderiza um spinner enquanto posts estiverem sendo carregados
    }
    this.loadPageData = this.loadPageData.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.appendPost = this.appendPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.getDarkTheme = this.getDarkTheme.bind(this);
  }

  /**
   * Carrega alguns posts para exibir no feed do usuário.
   */
  async loadPageData(){
    let searchQuery = this.props.location.search;
    if(searchQuery){
      let params = (new URL(document.location)).searchParams;
      let searchText = params.get("search");
      let req = await request.search(searchQuery);
      if(req.success){
        this.setState({
          searchString: searchText,
          searchResult: true,
          loadingPosts: false,
          posts: req.data
        })
      }
      else {
        //TODO - Melhor tratamento de erro durante a request de busca
        this.setState({
          loadingPosts: false
        })
      }
      
    }
    else {
      const posts = await request.loadSomePosts();
      this.setState({
        loadingPosts: false,
        posts
      })
    }
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
    let posts = [];
    if(this.state.posts.length){
      this.state.posts.forEach(post => {
        posts.push(
        <Post postData={post} 
        updatePost={this.updatePost} 
        deletePost={this.deletePost}
        appendPost={this.appendPost}
        key={post._id} 
        />)
      })
    }
    else{
      posts = <h6>No results found.</h6>
    }
    return posts;
  }

  render(){
    //Caso a session tenha expirado durante o runtime, redireciona:
    if(this.state.sessionExpired){
      return <Redirect to="/" />
    }
    //Caso ainda esteja carregando os dados do usuário do servidor:
    else if(this.state.loadingPosts){
      return <span></span>;
    }
    //Caso contrário, renderiza a página normalmente:
    else{
      return (
        <Container fluid className={"my-no-padding" + this.getDarkTheme() }>
          <Topbar logout={this.logout} toggleDarkTheme={this.toggleDarkTheme}/>
          <Container className={this.getPageClasses()}>
            <Row>
              <Col lg={2} className="d-none d-lg-flex pr-0 pl-0">
                <div className="my-ads pl-2">Ads</div>
              </Col>
              <Col xs={12} sm={8} lg={7} className="my-content-col order-md-2 order-lg-1 pt-1">
                { this.state.searchResult ? 
                <h4 className="mb-3">Search results for '{this.state.searchString}':</h4>
                : <PostForm appendPost={this.appendPost} />}
                { this.renderPosts() }
              </Col>
              <Col sm={4} lg={3} className="d-none d-sm-block pr-0 pr-lg-3 h-100 order-md-1 order-lg-2">
                <FollowingFeed />
              </Col>
            </Row>
          </Container>
        </Container>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);