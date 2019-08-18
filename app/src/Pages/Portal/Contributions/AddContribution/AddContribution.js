import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import AddContributionForm from '../../../../components/Forms/AddContribution/index';

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
