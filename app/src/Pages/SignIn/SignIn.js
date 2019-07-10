import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
import { connect } from "react-redux";
import { login, isLoggedIn } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";

class SignIn extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(){
    const { isLoggedIn, authError, flashMessage, history } = this.props;
    if(isLoggedIn){
      flashMessage('Signin Success', {props:{variant:'success'}});
      history.push('/dashboard');
    }else if(authError){
     flashMessage("Signin Error", {props:{variant:'error'}});
    }
  }
  
  render() {
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
    authError: state.auth.error
  }), 
  dispatch => {
    return {
      login: (email,password) => dispatch(login(email,password)),
      flashMessage: (message, options) => dispatch(flashMessage(message, options)),
      dispatch
    }
  }
)(SignIn);
