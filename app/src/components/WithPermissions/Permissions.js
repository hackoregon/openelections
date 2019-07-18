import React from 'react'
import PropTypes from 'prop-types'

export class WithPermissions extends React.Component {

  componentDidMount(): void {
    if (!this.props.isLoggedIn) {
      this.props.redirectToLogin()
    }
  }

  componentDidUpdate(): void {
    if (!this.props.isLoggedIn) {
      this.props.redirectToLogin()
    }
  }

  render() {
    const  { children } = this.props;
    return (<div>{children}</div>)
  }
}

WithPermissions.propTypes = {
  redirectToLogin: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool
};
