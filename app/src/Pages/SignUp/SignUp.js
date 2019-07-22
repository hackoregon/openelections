import React from "react";
import queryString from "query-string";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignUpForm from "../../components/Forms/SignUp/index";
import { connect } from "react-redux";
import { redeemInvite } from "../../state/ducks/auth";

class SignUp extends React.Component {

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
  state => ({}),
  dispatch => {
    return {
      redeemInvite: (invitationCode, password) => dispatch(redeemInvite(invitationCode, password))
    };
  }
)(SignUp);
