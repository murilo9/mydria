import React, { Component } from 'react';
import request from '../services/request.js';

import Media from 'react-bootstrap/Media';

export default class Post extends Component {

  render() {
    return (
      <Media>
        <img
          width={64}
          height={64}
          className="mr-3"
          src="assets/user.png"
          alt="Generic placeholder"
        />
        <Media.Body>
          <h5>Media Heading</h5>
          <p>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
            ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
            tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
            Donec lacinia congue felis in faucibus.
          </p>
        </Media.Body>
      </Media>
    )
  }
}