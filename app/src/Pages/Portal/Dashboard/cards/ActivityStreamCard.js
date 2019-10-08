import * as React from 'react';
import { connect } from 'react-redux';
import { ActivityList } from '../../../../components/Forms/ActivityStream/ActivitySection';
import { getCurrentGovernmentId } from '../../../../state/ducks/governments';
import { isGovAdmin, getCurrentCampaignId } from '../../../../state/ducks/auth';
import { getActivitiesByIdType } from '../../../../state/ducks/activities';

class ActivityStreamCard extends React.Component {
  constructor(props) {
    super(props);
    const { governmentId, campaignId, isGovAdmin, getActivities } = this.props;
    const id = isGovAdmin
      ? { governmentId, page: 0, perPage: 25 }
      : { campaignId, page: 0, perPage: 25 };
    getActivities(id);
  }

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

export default connect(
  state => ({
    governmentId: getCurrentGovernmentId(state),
    campaignId: getCurrentCampaignId(state),
    isGovAdmin: isGovAdmin(state),
  }),
  dispatch => ({
    getActivities: id => dispatch(getActivitiesByIdType(id)),
  })
)(ActivityStreamCard);
