import React from "react";
import { connect } from "react-redux";
import ManageCampaign from "./ManageCampaign";
//import { getCampaigns, getCampaignList, isCampaignsLoading } from "../../../state/ducks/users";
import { showModal } from "../../../state/ducks/modal";
import { isCampaignsLoading } from "../../../state/ducks/campaigns";

class ManageCampaignPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
   // this.props.getCampaigns(this.props.governmentId);
  }
  componentDidUpdate(prevProps) {
    //if (this.props.governmentId !== prevProps.governmentId) {
   //   this.props.getCampaigns(this.props.governmentId);
   // }
  }
  render () {
    console.log(this.props)
    return <ManageCampaign {...this.props} />;
  }
}

export default connect(
  state => ({
    // campaignList: getCampaignList(state),
    isCampaignListLoading: isCampaignsLoading(state),
    campaignId: state.campaigns.currentCampaignId,
    state
  }),
  dispatch => {
    return {
      // getCampaigns: (governmentId) => dispatch(getCampaigns(governmentId)),
      showModal: (payload) => dispatch(showModal( payload))
    };
  }
)(ManageCampaignPage);
