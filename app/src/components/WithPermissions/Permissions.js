import React from 'react';
import PropTypes from 'prop-types';

export class WithPermissions extends React.Component {
  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate() {
    this.checkLogin();
  }

  checkLogin() {
    const { isLoggedIn, redirectToLogin } = this.props;
    if (!isLoggedIn) {
      redirectToLogin();
    }
  }

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

WithPermissions.propTypes = {
  redirectToLogin: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};
