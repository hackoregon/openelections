import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../components/PageHoc/PageHoc';
import SignInForm from '../../components/Forms/SignIn/index';
import { login } from '../../state/ducks/auth';

class SignIn extends Component {
  render() {
    return (
      <PageHoc>
        <form>
          <SignInForm {...this.props} />
        </form>
      </PageHoc>
    );
  }
}

export default connect(null, dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
  dispatch,
}))(SignIn);
