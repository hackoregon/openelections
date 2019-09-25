import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ContributionReadyForm from '../../../../components/Forms/ContributionReady/index';
import { getActivities } from '../../../../state/ducks/activities';
import { postContributionComment } from '../../../../state/ducks/contributions';

class ContributionReadyPage extends React.Component {
  componentDidMount() {
    this.setState({
      activitiesList: this.props.getActivities,
      postContributionComment: this.props.postContributionComment,
    });
  }

  render() {
    const {
      match,
      history,
      getActivities,
      postContributionComment,
    } = this.props;
    let contributionId = false;
    if (match.params && match.params.id) {
      contributionId = match.params.id;
      return (
        <PageHoc>
          <ContributionReadyForm
            contributionId={contributionId}
            history={history}
            activitiesList={getActivities}
            postComment={postContributionComment}
          />
        </PageHoc>
      );
    }
  }
}

ContributionReadyPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default connect(state => ({
  getActivities: getActivities(state),
  postContributionComment: postContributionComment(state),
}))(ContributionReadyPage);
