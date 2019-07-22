import { connect } from "react-redux";
import Sidebar from "./Sidebar";
import { getCampaignName } from "../../state/ducks/campaigns";

export default connect(state => ({
  campaignName: getCampaignName(state),
  governmentId: state.governments.currentGovernmentId
}))(Sidebar);
