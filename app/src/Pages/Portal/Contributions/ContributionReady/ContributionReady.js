/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ContributionReadyForm from '../../../../components/Forms/ContributionReady/index';

class ContributionReadyPage extends React.Component {
  render() {
    const { match, history } = this.props;
    let contributionId = false;
    if (match.params && match.params.id) {
      contributionId = match.params.id;
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
}

ContributionReadyPage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
  }),
};

export default ContributionReadyPage;
