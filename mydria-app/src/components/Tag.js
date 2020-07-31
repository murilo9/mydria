import React, { Component } from 'react';

import Badge from 'react-bootstrap/Badge';

export default class Tag extends Component {

  render() {
    return <Badge variant={this.props.variant}>
      {this.props.text}
    </Badge>
  }
}