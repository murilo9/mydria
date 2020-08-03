import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';

export default class Post extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <Media>
        <img
          width={64}
          height={64}
          className="mr-3"
          src="assets/user.svg"
          alt="User picture"
        />
        <Media.Body>
          <h5>
            { this.props.data.author.nickname }
          </h5>
          <p>
            { this.props.data.text }
          </p>
        </Media.Body>
      </Media>
    )
  }
}