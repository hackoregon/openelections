import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Contributions from './Contributions';
import { getContributions } from '../../../state/ducks/contributions';
import {
  getCurrentCampaignId,
  getCurrentUserId,
} from '../../../state/ducks/auth';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';

class ContributionsPage extends React.Component {
  componentDidMount() {
    const {
      getContributions,
      currentUserId,
      governmentId,
      campaignId,
      location,
    } = this.props;

    const filterOptions = this.getQueryParams(location);

    getContributions({
      governmentId,
      campaignId,
      currentUserId,
      ...filterOptions,
    });
  }

  getQueryParams(location) {
    const rawParams = location.search.replace(/^\?/, '');
    const result = {};

    rawParams.split('&').forEach(item => {
      if (item) {
        const [key, val] = item.split('=');
        result[key] = val;
      }
    });

    return result;
  }

  render() {
    return <Contributions {...this.props} />;
  }
}
export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    governmentId: getCurrentGovernmentId(state),
    campaignId: getCurrentCampaignId(state),
  }),
  dispatch => ({ getContributions: data => dispatch(getContributions(data)) })
)(withRouter(ContributionsPage));
