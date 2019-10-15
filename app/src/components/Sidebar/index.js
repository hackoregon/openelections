import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import {
  getCurrentCampaignName,
  isGovAdmin,
  getCurrentCampaignId,
  isAssumed,
} from '../../state/ducks/auth';
import { getCampaignUsers } from '../../state/ducks/users';

export default connect(
  state => ({
    campaignName: getCurrentCampaignName(state),
    isGovAdmin: isGovAdmin(state),
    campaignId: getCurrentCampaignId(state),
    isAssumed: isAssumed(state),
  }),
  dispatch => {
    return {
      getCampaignUsers: campaignId => dispatch(getCampaignUsers(campaignId)),
    };
  }
)(Sidebar);
