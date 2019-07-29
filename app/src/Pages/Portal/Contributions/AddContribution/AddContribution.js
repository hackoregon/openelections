import React, { Component } from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import AddContributionForm from "../../../../components/Forms/AddContribution/index";
import { connect } from "react-redux";

class AddContribution extends Component {
  render() {
    return (
      <PageHoc>
        <AddContributionForm {...this.props} />
      </PageHoc>
    );
  }
}
export default connect()(AddContribution);
