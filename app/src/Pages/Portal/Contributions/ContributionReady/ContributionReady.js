import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ContributionReadyForm from '../../../../components/Forms/ContributionReady/index';
import {
  getContributionById,
  getCurrentContribution,
} from '../../../../state/ducks/contributions';
import {
  contributionsEmptyState,
  mapContributionDataToForm,
} from '../Utils/ContributionsFields';

class AddContribution extends Component {
  componentDidMount() {
    const { getContributionById, contributionId } = this.props;
    if (contributionId) getContributionById(parseInt(contributionId));
  }

  render() {
    const {
      contributions,
      contributionId,
      history,
      currentContribution,
    } = this.props;
    let data = contributionsEmptyState;
    if (currentContribution) {
      data = mapContributionDataToForm(currentContribution);
    }
    return (
      <PageHoc>
        <ContributionReadyForm
          data={data}
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
    history: ownProps.history,
    currentContribution: getCurrentContribution(state),
  }),
  dispatch => ({
    getContributionById: id => dispatch(getContributionById(id)),
  })
)(AddContribution);
