import React from 'react';
import PropTypes from 'prop-types';

export class WithAdminPermissions extends React.Component {
  componentDidMount() {
    const { isLoggedIn, redirectToLogin } = this.props;
    if (!isLoggedIn) {
      redirectToLogin();
    }
  }

  componentDidUpdate() {
    const { isLoggedIn, redirectToLogin } = this.props;
    if (!isLoggedIn) {
      redirectToLogin();
    }
  }

  render() {
    const { children, isAdmin } = this.props;
    return isAdmin ? <div>{children}</div> : <div />;
  }
}

WithAdminPermissions.propTypes = {
  redirectToLogin: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  isAdmin: PropTypes.bool,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};
