import React from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import ResetPasswordForm from "../../components/Forms/ResetPassword/index";
import { connect } from "react-redux";
import { updatePassword, isLoggedIn, logout } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  componentDidUpdate(){
    const { error, flashMessage, history, isLoading, logout } = this.props;
    if (this.state.submitted && !isLoading){
    if(error){
      flashMessage("Password update failed", {props:{variant:'error'}});
    }else {
      logout();
      flashMessage("Password updated", {props:{variant:'success'}});
      history.push('/sign-in');
    }
  }
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
    return {
      error: state.auth.error,
      isLoading: state.auth.isLoading,
      isLoggedIn: isLoggedIn(state) || false
    }
  }, 
  dispatch => {
    return {
      updatePassword: (oldPassword,newPassword) => dispatch(updatePassword(oldPassword,newPassword)),
      flashMessage: (message, options) => dispatch(flashMessage(message, options)),
      logout: () => dispatch(logout()), 
      dispatch
      }
    }
)(ResetPassword);
