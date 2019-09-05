import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import { getCampaignName } from '../../state/ducks/campaigns';
import { isGovAdmin, getCurrentCampaignId } from '../../state/ducks/auth';
import { getCampaignUsers } from '../../state/ducks/users';

export default connect(
  state => ({
    campaignName: getCampaignName(state),
    isGovAdmin: isGovAdmin(state),
    campaignId: getCurrentCampaignId(state),
  }),
  dispatch => {
    return {
      getCampaignUsers: campaignId => dispatch(getCampaignUsers(campaignId)),
    };
  }
)(Sidebar);
