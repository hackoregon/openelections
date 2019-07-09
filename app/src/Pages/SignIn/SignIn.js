import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
import { connect } from "react-redux";
import { login,isLoggedIn, logout } from "../../state/ducks/auth";
import { flashMessage, flashErrorMessage } from 'redux-flash';

class SignIn extends Component {
  
  constructor(props) {
    super(props);
    this.props.logout();
    this.state = {
      isSubmit: false
    }
  }
  
  
  render() {
    const { isLoggedIn, flashMessage, flashErrorMessage, history } = this.props;
    if(isLoggedIn && this.state.isSubmit == true){
      flashMessage('Signin Success');
      history.push('/dashboard');
    }else if(this.props.authError){
        flashErrorMessage('Signin Failure');
    }
    this.state.isSubmit = true;
    return (
      <PageHoc>
        <SignInForm {...this.props} />
      </PageHoc>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state) || false,
    authError: state.auth.error,
    isLoading: state.auth.isLoading
  }), 
  dispatch => {
    return {
      login: (email,password) => dispatch(login(email,password)),
      logout: () => dispatch(logout()),
      flashMessage: (message) => dispatch(flashMessage(message)),
      flashErrorMessage: (message) => dispatch(flashErrorMessage(message)),
      dispatch
    }
  }
)(SignIn);
