import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
import { connect } from "react-redux";
import { login } from "../../state/ducks/auth";

class SignIn extends Component {
  constructor(props) {
    super(props);
  }
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

export default connect(
  null,
  dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
    dispatch
  })
)(SignIn);
