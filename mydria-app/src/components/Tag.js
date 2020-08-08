import React, { Component } from 'react';

import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default class Tag extends Component {

  constructor(props){
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  handleCloseClick(e){
    e.preventDefault();
    this.props.removeTag(this.props.text)
  }

  render() {
    return <Badge variant={ this.props.variant } className="my-tag">
      { '#' + this.props.text }{' '}
      <a href="" 
      onClick={this.handleCloseClick}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </a>
    </Badge>
  }
}