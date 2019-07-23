import React from "react";
import { connect } from "react-redux";
import ManageCampaign from "./ManageCampaign";
import { getUsers, getCampaignUsers, isUsersLoading } from "../../../state/ducks/users";
import { showModal } from "../../../state/ducks/modal";

class ManageCampaignPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
   // this.props.getCampaignUsers(this.props.campaignId);
  }
  componentDidUpdate(prevProps) {
    //if (this.props.campaignId !== prevProps.campaignId) {
   //   this.props.getCampaignUsers(this.props.campaignId);
   // }
  }
  render () {
    return <ManageCampaign {...this.props} />;
  }
}

export default connect(
  state => ({
   // isUserListLoading: isUsersLoading(state),
   // userList: getUsers(state),
    campaignId: state.campaigns.currentCampaignId
  }),
  dispatch => {
    return {
     // getCampaignUsers: (id) => dispatch(getCampaignUsers(id)),
      showModal: (payload) => {
        dispatch(showModal( payload));
      }
    };
  }
)(ManageCampaignPage);
