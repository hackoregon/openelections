import React from 'react';
import { connect } from 'react-redux';
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
    } = this.props;
    getContributions({
      governmentId,
      campaignId,
      currentUserId,
    });
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
)(ContributionsPage);
