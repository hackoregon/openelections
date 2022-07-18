/* eslint-disable react/no-unused-state */
// TODO Look at submitted state variable is it doing anything
import React from 'react';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
import PageHoc from '../../components/PageHoc/PageHoc';
import ResetPasswordForm from '../../components/Forms/ResetPassword/index';
import { updatePassword } from '../../state/ducks/auth';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  render() {
    return (
      <PageHoc>
        <ResetPasswordForm
          {...this.props}
          submitted={() => this.setState({ submitted: true })}
        />
      </PageHoc>
    );
  }
}

export default connect(null, dispatch => {
  return {
    updatePassword: (oldPassword, newPassword) =>
      dispatch(updatePassword(oldPassword, newPassword)),
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    dispatch,
  };
})(ResetPassword);
