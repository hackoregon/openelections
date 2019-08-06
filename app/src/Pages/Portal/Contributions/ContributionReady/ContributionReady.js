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
      <PageHoc >
        <ContributionReadyForm contribution={this.props.currentContribution} />
      </PageHoc>
    );
  }
}
export default connect(
  (state, ownProps) => ({
    contributionId: parseInt(ownProps.match.params.id),
    contributions: state.contributions,
    currentContribution: state.contributions[ownProps.match.params.id] ? state.contributions[ownProps.match.params.id]: {}
  }),
  dispatch => ({
    getContributionById: (id) => dispatch(getContributionById(id))
  })
)(AddContribution);
