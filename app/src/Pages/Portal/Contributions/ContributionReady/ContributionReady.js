import React, { Component } from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import { connect } from "react-redux";
import ContributionReadyForm from '../../../../components/Forms/ContributionReady/index';
import { getContributionById } from "../../../../state/ducks/contributions";

class AddContribution extends Component {
  componentWillMount() {
    this.props.getContributionById(parseInt(this.props.contributionId))
  }

  render() {
    return (
      <PageHoc>
        <ContributionReadyForm contribution={this.props.contributions[this.props.contributionId]} />
      </PageHoc>
    );
  }
}
export default connect(
  (state, ownProps) => ({
    contributionId: parseInt(ownProps.match.params.id),
    contributions: state.contributions
  }),
  dispatch => ({
    getContributionById: (id) => dispatch(getContributionById(id))
  })
)(AddContribution);
