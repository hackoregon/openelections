import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ContributionReadyForm from '../../../../components/Forms/ContributionReady/index';
import {
  getContributionById,
  getCurrentContribution,
} from '../../../../state/ducks/contributions';
import { mapContributionDataToForm } from '../Utils/ContributionsFields';
import { PageTransitionImage } from '../../../../components/PageTransistion';

class AddContribution extends Component {
  componentDidMount() {
    const { getContributionById, contributionId } = this.props;
    if (contributionId) getContributionById(parseInt(contributionId));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(nextProps.currentContribution !== this.props.currentContribution);
  }

  render() {
    const { contributionId, currentContribution } = this.props;
    if (currentContribution) {
      const data = mapContributionDataToForm(currentContribution);

      return (
        <PageHoc>
          <ContributionReadyForm data={data} contributionId={contributionId} />
        </PageHoc>
      );
    }
    return <PageTransitionImage />;
  }
}

AddContribution.propTypes = {
  getContributionById: PropTypes.func,
  contributionId: PropTypes.number,
  currentContribution: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default connect(
  (state, ownProps) => ({
    contributionId: parseInt(ownProps.match.params.id),
    currentContribution: getCurrentContribution(state),
  }),
  dispatch => ({
    getContributionById: id => dispatch(getContributionById(id)),
  })
)(AddContribution);
