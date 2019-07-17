import React from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import ResetPasswordForm from "../../components/Forms/ResetPassword/index";
import { connect } from "react-redux";
import { updatePassword, isLoggedIn, logout } from "../../state/ducks/auth";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    //Check if they are logged in
  }
  render() {
    return (
      <PageHoc>
        <ResetPasswordForm 
          {...this.props} 
        />
      </PageHoc>
    );
  }
}
export default connect(
  state => { 
    return {
      isLoggedIn: isLoggedIn(state) || false
    }
  }, 
  dispatch => {
    return {
      updatePassword: (oldPassword,newPassword) => dispatch(updatePassword(oldPassword,newPassword)),
      dispatch
      }
    }
)(ResetPassword);
