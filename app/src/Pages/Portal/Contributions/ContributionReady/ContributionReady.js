import React, { Component } from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import { connect } from "react-redux";
import ContributionReadyForm from '../../../../components/Forms/ContributionReady/index';
import { getContributionById } from "../../../../state/ducks/contributions";

class AddContribution extends Component {
  componentDidMount() {
    const { getContributionById, contributionId } = this.props
    getContributionById(parseInt(contributionId))
  }

  render() {
    const { contributions, contributionId, history } = this.props
    const data =  contributions[contributionId] || {}
    return (
      <PageHoc>
        <ContributionReadyForm
          contributionId={contributionId}
          history={history}
        />
      </PageHoc>
    );
  }
}
export default connect(
  (state, ownProps) => ({
    contributionId: parseInt(ownProps.match.params.id),
    contributions: state.contributions,
    history: ownProps.history
  }),
  dispatch => ({
    getContributionById: (id) => dispatch(getContributionById(id))
  })
)(AddContribution);
