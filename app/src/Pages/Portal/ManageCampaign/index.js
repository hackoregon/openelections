import React from "react";
import { connect } from "react-redux";
import ManageCampaign from "./ManageCampaign";
import { showModal } from "../../../state/ducks/modal";
import { isCampaignsLoading, getCampaigns, getCampaignList } from "../../../state/ducks/campaigns";
import { getCurrentGovernmentId } from "../../../state/ducks/governments";


class ManageCampaignPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getCampaigns(this.props.governmentId);
  }

  render () {
    return <ManageCampaign {...this.props} />;
  }
}

export default connect(
  state => ({
    governmentId: getCurrentGovernmentId(state),
    isCampaignListLoading: isCampaignsLoading(state),
    campaignList: getCampaignList(state),
  }),
  dispatch => {
    return {
      getCampaigns: (governmentId) => dispatch(getCampaigns(governmentId)),
      showModal: (payload) => dispatch(showModal( payload))
    };
  }
)(ManageCampaignPage);
