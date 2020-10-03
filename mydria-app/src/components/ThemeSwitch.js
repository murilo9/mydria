import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from '../pages/base.js';

import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons';

class ThemeSwitch extends React.Component {

  constructor(props){
    super(props);
    this.toggleDarkTheme = this.toggleDarkTheme.bind(this);
    this.renderMobileIcon = this.renderMobileIcon.bind(this);
  }

  isDarkTheme(){
    return this.Cookies.get('darkTheme');
  }

  toggleDarkTheme(){
    this.props.toggleDarkTheme();
  }

  renderMobileIcon(){
    return <div className="mr-3 h-100 d-flex align-items-center" onClick={this.toggleDarkTheme}>
      {
        this.props.session.darkTheme ?
        <FontAwesomeIcon icon={faMoon} className="my-moon-icon" />
        :
        <FontAwesomeIcon icon={faSun} className="my-sun-icon" />
      }
    </div>
  }

  render(){
    return <React.Fragment>
      <div className="my-theme-switch d-none d-md-flex row align-items-center ml-0 mr-3">
        <FontAwesomeIcon icon={faSun} className="my-sun-icon" />
        <Form.Check 
          type="switch"
          id="my-theme-switch-desktop"
          label=""
          className="mr-2 ml-2"
          checked={this.props.session.darkTheme}
          onChange={this.toggleDarkTheme}
        />
        <FontAwesomeIcon icon={faMoon} className="my-moon-icon" />
      </div>
      <div className="my-theme-switch-mobile d-xs-flex d-md-none align-items-center">
        { this.renderMobileIcon() }
      </div>
    </React.Fragment>
  }
}

export default connect(mapStateToProps)(ThemeSwitch);