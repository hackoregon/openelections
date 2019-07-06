import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
import { connect } from "react-redux";
import { login } from "../../state/ducks/auth";import { applyMiddleware, createStore, combineReducers } from 'redux'
import { flashMessage } from 'redux-flash';

class SignIn extends Component {
  componentWillUpdate(newprops){
    if (!(typeof newprops.state.me == 'undefined' || !newprops.state.me)) {
      this.props.flashMessage('Signin Success');
      this.props.history.push('/dashboard');
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
      flashMessage: (message) => dispatch(flashMessage(message)),
      dispatch
      }
    }
  )(SignIn);
