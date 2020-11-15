import React from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { MydriaPage, mapStateToProps, mapDispatchToProps } from './base';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Topbar from '../components/Topbar';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import FollowingFeed from '../components/FollowingFeed';

class PostPage extends MydriaPage {

  constructor(props){
    super(props);
    this.state = {
      post: null,
      loadingPost: true,
      sessionExpired: false,  //Renderiza um objeto <Redirect> para voltar à página de login
    }
    this.loadPageData = this.loadPageData.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async loadPageData(){
    const { postId } = this.props.match.params;
    const req = await request.loadPostData(postId);
    if(req.success){
      this.setState({
        postData: req.data,
        loadingPost: false
      })
    }
    else{
      //TODO - Tratamento de erro ao carregar o post
    }
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

  render(){
    //Caso a session tenha expirado durante o runtime, redireciona:
    if(this.state.sessionExpired){
      return <Redirect to="/" />
    }
    //Caso ainda esteja carregando os dados do post do servidor:
    else if(this.state.loadingPost){
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
                <Post postData={this.state.postData}
                updatePost={this.updatePost} 
                deletePost={this.deletePost} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PostPage)