import { connect } from "react-redux";
import Sidebar from "./Sidebar";
import { getCampaignName } from "../../state/ducks/campaigns";
import { getCurrentGovernmentId } from "../../state/ducks/governments";

export default connect(state => ({
  campaignName: getCampaignName(state),
  governmentId: getCurrentGovernmentId(state)
}))(Sidebar);
