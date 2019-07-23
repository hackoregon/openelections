import React, { Component } from "react";
import queryString from "query-string";
import PageHoc from "../../components/PageHoc/PageHoc";
import Invitation from "../../components/Invitation";
import { connect } from "react-redux";

class InvitationPage extends Component {
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

export default connect()(InvitationPage);
