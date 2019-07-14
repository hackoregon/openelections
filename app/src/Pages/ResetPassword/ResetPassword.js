import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import ResetPasswordForm from "../../components/Forms/ResetPassword/index";
import { connect } from "react-redux";
import { updatePassword } from "../../state/ducks/auth";

class ResetPassword extends Component {
  render() {
    return (
      <PageHoc>
        <ResetPasswordForm {...this.props} />
      </PageHoc>
    );
  }
}
 
export default connect(
state => { 
  return {state: state.auth}
}, 
dispatch => {
  return {
    updatePassword: (oldPassword,newPassword) => dispatch(updatePassword(oldPassword,newPassword)),
    dispatch
    }
  }
)(ResetPassword);
