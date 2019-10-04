import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import {
  getCampaignActivities,
  getGovernmentActivities,
} from '../../../../state/ducks/activities';
import { ActivityList } from '../../../../components/Forms/ActivityStream/ActivitySection';
import { getCurrentGovernmentId } from '../../../../state/ducks/governments';
import { isGovAdmin, getCurrentCampaignId } from '../../../../state/ducks/auth';
// const styles = css`
//   ul {
//     list-style: none;
//     padding: 0;
//     font-size: 20px;
//   }
// `;

class ActivityStreamCard extends React.Component {
  constructor(props) {
    super(props);
    if (isGovAdmin) {
      props.getCampaignActivities(props.governmentId);
    } else {
      props.getCampaignActivities(props.campaignId);
    }
  }

  render() {
    return (
      <div>
        <h3>Recent Activity</h3>
        <ActivityList />
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
  dispatch => {
    return {
      getCampaignActivities: id => dispatch(getCampaignActivities(id)),
      getGovernmentActivities: id => dispatch(getGovernmentActivities(id)),
    };
  }
)(ActivityStreamCard);
