import React from 'react';
import Cookies from 'js-cookie';
import request from '../services/request.js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { MydriaPage, mapStateToProps, mapDispatchToProps } from './base';

import ProfilePicture from '../components/ProfilePicture.js';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import {
  faCaretDown,
  faCaretUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Topbar from '../components/Topbar';

class FollowsPage extends MydriaPage {

  constructor(props){
    super(props);
    this.state = {
      showingFollowed: false,
      showingFollowing: false,
      sessionExpired: false,  //Renderiza um objeto <Redirect> para voltar à página de login
    }
    this.getFollowedQty = this.getFollowedQty.bind(this);
    this.getFollowingQty = this.getFollowingQty.bind(this);
    this.toggleShowFollowed = this.toggleShowFollowed.bind(this);
    this.toggleShowFollowing = this.toggleShowFollowing.bind(this);
    this.renderFollowedList = this.renderFollowedList.bind(this);
    this.renderFollowingList = this.renderFollowingList.bind(this);
  }

  loadPageData(){}

  getFollowedQty(){
    return this.props.user.followedBy.length;
  }

  getFollowingQty(){
    return this.props.user.following.length;
  }

  toggleShowFollowing(){
    this.setState({
      showingFollowing: !this.state.showingFollowing,
      showingFollowed: false
    })
  }

  toggleShowFollowed(){
    this.setState({
      showingFollowed: !this.state.showingFollowed,
      showingFollowing: false
    })
  }

  getFollowingCaretIcon(){
    return this.state.showingFollowing ? 
    <FontAwesomeIcon icon={faCaretUp} />
    : <FontAwesomeIcon icon={faCaretDown} />
  }

  getFollowedCaretIcon(){
    return this.state.showingFollowed ?
    <FontAwesomeIcon icon={faCaretUp} />
    : <FontAwesomeIcon icon={faCaretDown} />
  }

  renderFollowingList(){
    let following = [];
    this.props.user.following.forEach(followedUser => {
      following.push(
        <ListGroup.Item key={followedUser.nickName} className="pr-1 pr-md-2 pl-r pl-md-2">
          <ProfilePicture nickname={followedUser.nickname}
            pictureId={followedUser.profilePicture} 
            size="small" />
          <a href={"/profile/" + followedUser.nickname} className="my-post-author-name">
            <strong>{followedUser.nickname}</strong>
          </a>
        </ListGroup.Item>
      )
    })
    return following;
  }

  renderFollowedList(){
    let followed = [];
    console.log(this.props.user.followedBy)
    this.props.user.followedBy.forEach(followingUser => {
      followed.push(
        <ListGroup.Item key={followingUser.nickName} className="pr-1 pr-md-2 pl-r pl-md-2">
          <ProfilePicture nickname={followingUser.nickname}
            pictureId={followingUser.profilePicture} 
            size="small" />
          <a href={"/profile/" + followingUser.nickname} className="my-post-author-name">
            <strong>{followingUser.nickname}</strong>
          </a>
        </ListGroup.Item>
      )
    })
    return followed;
  }

  render(){
    //Caso a session tenha expirado durante o runtime, redireciona:
    if(this.state.sessionExpired){
      return <Redirect to="/" />
    }
    //Caso ainda esteja carregando os dados do servidor:
    else if(this.state.loadingNotifs){
      return <span></span>;
    }
    //Caso contrário, renderiza a página normalmente:
    else{
      return <React.Fragment>
        <Container fluid className={"my-no-padding" + this.getDarkTheme() }>
          <Topbar logout={this.logout} toggleDarkTheme={this.toggleDarkTheme}/>
          <Container className={this.getPageClasses()}>
            <Row>
              <Col lg={2} className="d-none d-lg-flex pr-0 pl-0">
                <div className="my-ads pl-2">Ads</div>
              </Col>
              <Col xs={12} sm={8} lg={7} className="my-content-col order-md-2 order-lg-1">
                <h3 className="mb-3">Follows</h3>
                <Accordion>
                  <Card>
                    <Card.Header className="followed-header d-flex 
                    align-items-center justify-content-between">
                      <span>
                        You're currently followed by { this.getFollowedQty() } people.
                      </span>
                      <Accordion.Toggle as={Button} onClick={this.toggleShowFollowed}
                       variant="white" eventKey="0">
                        { this.getFollowedCaretIcon() }
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <ListGroup variant="flush">
                          { this.renderFollowingList() }
                        </ListGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card>
                    <Card.Header className="followed-header d-flex
                    align-items-center justify-content-between">
                      <span>
                        You are currently following { this.getFollowingQty() } people.
                      </span>
                      <Accordion.Toggle as={Button} onClick={this.toggleShowFollowing}
                       variant="white" eventKey="1">
                        { this.getFollowingCaretIcon() }
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        <ListGroup variant="flush">
                          { this.renderFollowedList() }
                        </ListGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            </Row>
          </Container>
        </Container>
      </React.Fragment>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowsPage);