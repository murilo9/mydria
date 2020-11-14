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
import Notification from '../components/Notification';
import FollowingFeed from '../components/FollowingFeed';

class NotificationPage extends MydriaPage {

  constructor(props){
    super(props);
    this.state = {
      notifications: [],
      sessionExpired: false,  //Renderiza um objeto <Redirect> para voltar à página de login
    }
    this.loadPageData = this.loadPageData.bind(this);
    this.renderNotifications = this.renderNotifications.bind(this);
  }

  async loadPageData(){
    let req = await request.getNotifications();
    if(req.success){
      this.setState({
        notifications: req.data
      })
    }
    else{
      //TODO - Tratamento de erro ao carregar as notificações
    }
  }

  renderNotifications(){
    let notifications = [];
    //Insere até 8 notificações na lista
    for(let n = 0; n < 8; n++){
      if(this.state.notifications[n]){
        let notification = this.state.notifications[n];
        notifications.push(<Notification data={notification} key={notification._id} />)
      }
    }
    return notifications.length ? notifications : 'No notifications to show.';
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
      return <React.Fragment>
        <Container fluid className={"my-no-padding" + this.getDarkTheme() }>
          <Topbar logout={this.logout} toggleDarkTheme={this.toggleDarkTheme}/>
          <Container className={this.getPageClasses()}>
            <Row>
              <Col lg={2} className="d-none d-lg-flex pr-0 pl-0">
                <div className="my-ads pl-2">Ads</div>
              </Col>
              <Col xs={12} sm={8} lg={7} className="my-content-col order-md-2 order-lg-1">
                { this.renderNotifications() }
              </Col>
              <Col sm={4} lg={3} className="d-none d-sm-block pr-0 pr-lg-3 h-100 order-md-1 order-lg-2">
                <FollowingFeed />
              </Col>
            </Row>
          </Container>
        </Container>
      </React.Fragment>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPage);