import React, { Component } from "react";
import queryString from "query-string";
import { flashMessage } from "redux-flash";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignUpForm from "../../components/Forms/SignUp/index";
import { connect } from "react-redux";
import { redeemInvite, isLoggedIn } from "../../state/ducks/auth";

class SignUp extends Component {
  componentDidUpdate() {
    const { isLoggedIn, authError, flashMessage, history } = this.props;
    if (isLoggedIn) {
      flashMessage("Signup Success", { props: { variant: "success" } }); // Todo, implement success
      history.push("/dashboard");
    } else if (authError) {
      flashMessage("Signup Error", { props: { variant: "error" } }); //Todo, implement failure
    }
  }

  render() {
    const { location } = this.props;
    const params = queryString.parse(location.search);
    const { invitationCode } = params;
    return (
      <PageHoc>
        <SignUpForm code={invitationCode} {...this.props} />
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
      redeemInvite: (invitationCode, password) =>
        dispatch(redeemInvite(invitationCode, password)),
      flashMessage: (message, options) =>
        dispatch(flashMessage(message, options)),
      dispatch
    };
  }
)(SignUp);
