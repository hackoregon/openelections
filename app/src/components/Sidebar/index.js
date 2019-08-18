import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import { getCampaignName } from '../../state/ducks/campaigns';
import { isGovAdmin } from '../../state/ducks/auth';

export default connect(state => ({
  campaignName: getCampaignName(state),
  isGovAdmin: isGovAdmin(state),
}))(Sidebar);
