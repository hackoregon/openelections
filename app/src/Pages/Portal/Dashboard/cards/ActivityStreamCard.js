import * as React from 'react';
import { connect } from 'react-redux';
import { ActivityList } from '../../../../components/Forms/ActivityStream/ActivitySection';
import { getCurrentGovernmentId } from '../../../../state/ducks/governments';
import { isGovAdmin, getCurrentCampaignId } from '../../../../state/ducks/auth';

class ActivityStreamCard extends React.Component {
  render() {
    const { governmentId, campaignId, isGovAdmin } = this.props;
    const id = isGovAdmin ? { governmentId } : { campaignId };
    return (
      <div>
        <h3>Recent Activity</h3>
        <ActivityList {...id} />
      </div>
    );
  }
}

export default connect(state => ({
  governmentId: getCurrentGovernmentId(state),
  campaignId: getCurrentCampaignId(state),
  isGovAdmin: isGovAdmin(state),
}))(ActivityStreamCard);
