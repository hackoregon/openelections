import React from 'react';
import PropTypes from 'prop-types';

export class WithAdminPermissions extends React.Component {
  componentDidMount() {
    if (!this.props.isLoggedIn) {
      this.props.redirectToLogin();
    }
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn) {
      this.props.redirectToLogin();
    }
  }

  render() {
    const { children } = this.props;
    return this.props.isAdmin ? <div>{children}</div> : <div />;
  }
}

WithAdminPermissions.propTypes = {
  redirectToLogin: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  isAdmin: PropTypes.bool,
};
