import React, { Component } from "react";
import queryString from "query-string";
import PageHoc from "../../components/PageHoc/PageHoc";
import Invitation from "../../components/Invitation";
import { connect } from "react-redux";
import { login, isLoggedIn } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";

class InvitationPage extends Component {
// TODO: Connect flash messaging
  componentDidUpdate() {
    const { isLoggedIn, authError, flashMessage, history } = this.props;
    if (isLoggedIn) {
      flashMessage("Signin Success", { props: { variant: "success" } });
      history.push("/dashboard");
    } else if (authError) {
      flashMessage("Signin Error", { props: { variant: "error" } });
    }
  }

  render() {
    const { location } = this.props;
    const params = queryString.parse(location.search);
    const { email, campaign, government, invitationCode } = params;

    return (
      <PageHoc>
        <Invitation code={invitationCode} campaign={campaign} email={email} government={government} {...this.props} />
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
      flashMessage: (message, options) =>
        dispatch(flashMessage(message, options)),
      dispatch
    };
  }
)(InvitationPage);
