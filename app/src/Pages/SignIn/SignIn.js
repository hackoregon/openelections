import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
import { connect } from "react-redux";
import { login } from "../../state/ducks/auth";

class SignIn extends Component {
  componentWillUpdate(newprops){
    if (!(typeof newprops.state.me == 'undefined' || !newprops.state.me)) {
      this.props.history.push('/dashboard')
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
  state => { 
    return {state: state.auth}
  }, 
  dispatch => {
    return {
      login: (email,password) => dispatch(login(email,password)),
      dispatch
      }
    }
  )(SignIn);
