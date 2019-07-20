import React from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import ResetPasswordForm from "../../components/Forms/ResetPassword/index";
import { connect } from "react-redux";
import { updatePassword, isLoggedIn } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";

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
          submitted={() => this.setState({submitted: true})} 
        />
      </PageHoc>
    );
  }
}

export default connect(
  state => { 
    return { }
  }, 
  dispatch => {
    return {
      updatePassword: (oldPassword,newPassword) => dispatch(updatePassword(oldPassword,newPassword)),
      flashMessage: (message, options) => dispatch(flashMessage(message, options)),    
      dispatch
      }
    }
)(ResetPassword);
