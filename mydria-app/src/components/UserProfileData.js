import React, { Component } from 'react';
import request from '../services/request.js';
import { connect } from 'react-redux';

import sanitize from '../helpers/stringSanitizer.js';
import requestService from '../services/request.js';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faUsers,
  faCamera
} from '@fortawesome/free-solid-svg-icons';

function mapStateToProps(state) {
  return { ...state }
}

export class UserProfileData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEditForm: false,
      showErrorMessage: false
    }
    this.renderBio = this.renderBio.bind(this);
    this.renderLocation = this.renderLocation.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.ownProfile = this.ownProfile.bind(this);
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.buildUserData = this.buildUserData.bind(this);
    this.saveProfileData = this.saveProfileData.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
  }

  ownProfile() {
    return this.props.userData.nickname === this.props.user.nickname;
  }

  buildUserData() {
    const bio = sanitize(document.getElementById('formBasicBio').value);
    const country = sanitize(document.getElementById('formBasicCountry').value);
    const city = sanitize(document.getElementById('formBasicCity').value);
    const userData = {
      ...this.state.userData,
      bio,
      country,
      city
    }
    return userData;
  }

  async saveProfileData() {
    const userData = this.buildUserData();
    let res = await requestService.updateUserData(this.props.user.nickname, userData);
    if (res.success) {
      this.props.updateUserData(userData);
      this.setState({
        showEditForm: false
      })
    }
    else {
      this.setState({
        showErrorMessage: `There was an error while trying to update your profile data. 
        Please wait a few moments and try again.`
      })
    }
  }

  renderErrorMessage() {
    return (
      this.state.showErrorMessage ?
        <Alert variant="danger">
          {this.state.showErrorMessage}
        </Alert>
        : null
    )
  }

  renderBio() {
    return (
      this.props.userData.bio ?
        <Card.Text className="my-profile-data-bio">
          {this.props.userData.bio}
        </Card.Text>
        : null
    )
  }

  renderLocation() {
    return (
      this.props.userData.country ?
        <Card.Text>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="my-profile-data-icon" />{' '}
          {this.props.userData.city ?
            this.props.userData.city + ', ' : null}
          {this.props.userData.country}
        </Card.Text>
        : null
    )
  }

  renderFollowButton() {
    if (!this.ownProfile()) {
      return (
        this.props.following ?
          <Button variant="success" onClick={this.props.unfollowClick} block>
            Unfollow
        </Button>
          :
          <Button variant="primary" onClick={this.props.followClick} block>
            Follow
        </Button>
      )
    }
    else {
      return null;
    }
  }

  toggleEditForm() {
    this.setState({
      showEditForm: !this.state.showEditForm,
      showErrorMessage: false
    })
    if (!this.state.showEditForm) {
      //Gambiarra pra preencher os inputs só após eles terem sido renderizados:
      setTimeout(() => {
        document.getElementById('formBasicBio').value = this.props.userData.bio;
        document.getElementById('formBasicCountry').value = this.props.userData.country;
        document.getElementById('formBasicCity').value = this.props.userData.city;
      }, 50)
    }
  }

  renderEditForm() {
    return <React.Fragment>
      <Card.Body>
        <Form>
          {this.renderErrorMessage()}
          <Form.Group controlId="formBasicBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows="3" />
          </Form.Group>
          <Form.Group controlId="formBasicCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" placeholder="Country" />
          </Form.Group>
          <Form.Group controlId="formBasicCity">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="City" />
          </Form.Group>
        </Form>
        <Row className="justify-content-between">
          <Col xs={6}>
            <Button variant="secondary" block onClick={this.toggleEditForm}>Cancel</Button>
          </Col>
          <Col xs={6}>
            <Button variant="primary" block onClick={this.saveProfileData}>Save</Button>
          </Col>
        </Row>
      </Card.Body>
    </React.Fragment>
  }

  renderInfo() {
    return <React.Fragment>
      <Card.Body>
        <Card.Title className="my-profile-data-title">
          {this.props.userData.nickname}
        </Card.Title>
        {this.renderBio()}
        {this.renderLocation()}
        <Card.Text>
          <FontAwesomeIcon icon={faUsers} className="my-profile-data-icon" />{' '}
          {this.props.userData.followedBy.length + ' follower' +
            (this.props.userData.followedBy.length === 1 ? '' : 's')}
        </Card.Text>
        {this.renderFollowButton()}
      </Card.Body>
      {this.ownProfile() ?
        <Button variant="link" onClick={this.toggleEditForm}>Edit</Button> : null}
    </React.Fragment>
  }

  render() {
    return (
      <Card className="mb-3">
        <div className="my-profile-picture-wrapper">
          <div className="my-profile-picture"
            style={{ backgroundImage: 'url(/assets/user.svg)' }}></div>

        </div>
        <div className="my-profile-picture-button-wall">
          <Button variant="success" round className="my-profile-picture-change">
            <FontAwesomeIcon icon={faCamera} />
          </Button>
        </div>
        {this.state.showEditForm ? this.renderEditForm() : this.renderInfo()}
      </Card>
    )
  }
}

export default connect(mapStateToProps)(UserProfileData);