import React from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import ResetPasswordForm from "../../components/Forms/ResetPassword/index";
import { connect } from "react-redux";
import { updatePassword, isLoggedIn } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";
import { isNull } from "util";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  componentDidUpdate(){
    const { error, flashMessage, history, isLoading } = this.props;
    if (this.state.submitted && !isLoading){
    if(error){
      flashMessage("Password update failed", {props:{variant:'error'}});
    }else {
      flashMessage("Password updated", {props:{variant:'success'}});
      history.push('/dashboard');
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
      dispatch
      }
    }
)(ResetPassword);
